-- Account foundation only. This is NOT the restaurant-operational schema.
-- No prices, sample restaurants, paid entitlements or accounts are seeded.
create table public.r8_workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 100),
  country_code text not null default 'NP' check (country_code = 'NP'),
  timezone text not null default 'Asia/Kathmandu' check (timezone = 'Asia/Kathmandu'),
  created_at timestamptz not null default now()
);
create table public.r8_memberships (
  workspace_id uuid not null references public.r8_workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','manager','cashier','kitchen','viewer')),
  created_at timestamptz not null default now(),
  primary key (workspace_id,user_id)
);
create index r8_memberships_user_idx on public.r8_memberships(user_id);
create table public.r8_billing_plans (
  id text primary key check (id ~ '^[a-z0-9_-]{2,60}$'),
  name text not null check (char_length(name) between 1 and 60),
  description text not null default '',
  currency text not null check (currency in ('NPR','USD')),
  amount_minor bigint not null check (amount_minor > 0 and amount_minor <= 100000000),
  interval text not null check (interval in ('month','year')),
  features jsonb not null default '[]'::jsonb check (jsonb_typeof(features) = 'array'),
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table public.r8_subscriptions (
  workspace_id uuid primary key references public.r8_workspaces(id) on delete cascade,
  plan_id text references public.r8_billing_plans(id),
  status text not null default 'pending' check (status in ('pending','trialing','active','past_due','unpaid','canceled','expired')),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now(),
  check (status not in ('trialing','active') or (plan_id is not null and current_period_end is not null))
);
create index r8_subscriptions_plan_idx on public.r8_subscriptions(plan_id);

alter table public.r8_workspaces enable row level security;
alter table public.r8_memberships enable row level security;
alter table public.r8_billing_plans enable row level security;
alter table public.r8_subscriptions enable row level security;

-- Client roles are read-only. Workspace creation is a narrowly scoped RPC below.
revoke all on public.r8_workspaces, public.r8_memberships, public.r8_billing_plans, public.r8_subscriptions from anon, authenticated;
grant select on public.r8_billing_plans to anon, authenticated;
grant select on public.r8_workspaces, public.r8_memberships, public.r8_subscriptions to authenticated;

create policy r8_owner_reads_workspace on public.r8_workspaces for select to authenticated using (owner_id = (select auth.uid()));
create policy r8_user_reads_membership on public.r8_memberships for select to authenticated using (user_id = (select auth.uid()));
create policy r8_public_reads_published_plans on public.r8_billing_plans for select to anon, authenticated using (active);
create policy r8_owner_reads_subscription on public.r8_subscriptions for select to authenticated using (
  exists (select 1 from public.r8_workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid()))
);

-- Definer is necessary for atomic creation: clients have no direct insert grants.
-- Caller identity comes from Auth, never request-supplied owner/role metadata.
create function public.r8_create_workspace(workspace_name text, country text default 'NP', workspace_timezone text default 'Asia/Kathmandu')
returns uuid
language plpgsql security definer
set search_path = ''
as $$
declare caller uuid := auth.uid(); result uuid;
begin
  if caller is null or not exists (
    select 1 from auth.users u where u.id = caller and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
  ) then raise exception 'Verified account required' using errcode = '42501'; end if;
  if workspace_name is null or char_length(btrim(workspace_name)) not between 2 and 100
     or country is distinct from 'NP' or workspace_timezone is distinct from 'Asia/Kathmandu'
  then raise exception 'Invalid workspace details' using errcode = '22023'; end if;

  insert into public.r8_workspaces(owner_id,name,country_code,timezone)
    values(caller,btrim(workspace_name),country,workspace_timezone)
    on conflict(owner_id) do nothing returning id into result;
  if result is null then select w.id into result from public.r8_workspaces w where w.owner_id = caller; end if;
  insert into public.r8_memberships(workspace_id,user_id,role) values(result,caller,'owner')
    on conflict(workspace_id,user_id) do nothing;
  return result;
end;
$$;
revoke all on function public.r8_create_workspace(text,text,text) from public, anon;
grant execute on function public.r8_create_workspace(text,text,text) to authenticated;
comment on table public.r8_subscriptions is 'Server-write-only. Update only after provider verification and idempotent webhook processing; not from checkout redirects.';
comment on table public.r8_billing_plans is 'Public pricing only. Keep payment-provider secrets and private price mappings outside exposed tables.';
