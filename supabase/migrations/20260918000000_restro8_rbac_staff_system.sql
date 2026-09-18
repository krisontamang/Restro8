-- ==========================================================================
-- RESTRO8 — RBAC, MULTI-BRANCH, PERMISSIONS & AUDIT LOG SCHEMA
-- ==========================================================================

-- 1. Branches Table (Multi-branch isolation)
create table if not exists public.r8_branches (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.r8_workspaces(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 100),
  code text not null check (code ~ '^[A-Za-z0-9_-]{2,20}$'),
  location text not null default '',
  phone text default '',
  is_main boolean not null default false,
  status text not null default 'active' check (status in ('active','inactive','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, code)
);
create index if not exists r8_branches_workspace_idx on public.r8_branches(workspace_id);

-- 2. Core Roles Table
create table if not exists public.r8_roles (
  id text primary key check (id in ('owner','manager','waiter','chef','cashier')),
  name text not null,
  description text not null default '',
  hierarchy_level int not null default 1,
  created_at timestamptz not null default now()
);

-- Seed Canonical Roles
insert into public.r8_roles (id, name, description, hierarchy_level)
values
  ('owner', 'Owner', 'Complete restaurant and business oversight, financial administration, subscription, and user access.', 5),
  ('manager', 'Manager', 'Day-to-day operations, floor and kitchen supervision, shift approvals, and daily sales monitoring.', 4),
  ('cashier', 'Cashier', 'POS billing, invoice generation, payment collection, cash drawer balancing, and receipt printing.', 3),
  ('chef', 'Chef', 'Kitchen Display System (KDS) queue management, ticket preparation, and ingredient status tracking.', 2),
  ('waiter', 'Waiter', 'Floor operations, table status, taking customer orders with special notes, and kitchen dispatch.', 1)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  hierarchy_level = excluded.hierarchy_level;

-- 3. Fine-Grained Permissions Table
create table if not exists public.r8_permissions (
  id text primary key check (id ~ '^[a-z0-9_.-]{3,60}$'),
  key text not null unique,
  module text not null,
  description text not null default ''
);

-- Seed Granular Permissions
insert into public.r8_permissions (id, key, module, description)
values
  ('order.create', 'order.create', 'orders', 'Create new dine-in, takeaway, or delivery orders'),
  ('order.view', 'order.view', 'orders', 'View active and historical orders'),
  ('order.edit', 'order.edit', 'orders', 'Modify order items and notes before preparation'),
  ('order.cancel', 'order.cancel', 'orders', 'Request order cancellation'),
  ('order.cancel.approve', 'order.cancel.approve', 'orders', 'Approve or reject order cancellation requests'),

  ('kitchen.view', 'kitchen.view', 'kitchen', 'Access Kitchen Display System (KDS) queue'),
  ('kitchen.accept', 'kitchen.accept', 'kitchen', 'Accept incoming food tickets'),
  ('kitchen.prepare', 'kitchen.prepare', 'kitchen', 'Mark tickets as actively preparing'),
  ('kitchen.complete', 'kitchen.complete', 'kitchen', 'Mark kitchen orders as ready for the pass'),
  ('kitchen.item_toggle', 'kitchen.item_toggle', 'kitchen', 'Mark dishes as 86/sold-out'),

  ('payment.view', 'payment.view', 'payments', 'View payment receipts and open bills'),
  ('payment.collect', 'payment.collect', 'payments', 'Process bill payments via Cash, Card, QR or Bank'),
  ('payment.refund.request', 'payment.refund.request', 'payments', 'Request customer payment refund'),
  ('payment.refund.approve', 'payment.refund.approve', 'payments', 'Approve customer refunds'),
  ('payment.discount', 'payment.discount', 'payments', 'Apply authorized discounts on bills'),

  ('sales.daily.view', 'sales.daily.view', 'sales', 'View current shift and daily sales totals'),
  ('sales.report.view', 'sales.report.view', 'sales', 'Access comprehensive revenue and sales reports'),
  ('profit.view', 'profit.view', 'sales', 'View net business profit, margins, and cost accounting'),

  ('menu.view', 'menu.view', 'menu', 'View dishes, categories, and item availability'),
  ('menu.edit', 'menu.edit', 'menu', 'Modify dish descriptions, categories, and tags'),
  ('menu.price.edit', 'menu.price.edit', 'menu', 'Change prices on menu dishes'),

  ('inventory.view', 'inventory.view', 'inventory', 'View current stock levels and alerts'),
  ('inventory.edit', 'inventory.edit', 'inventory', 'Adjust inventory quantities and consumption'),
  ('purchasing.manage', 'purchasing.manage', 'inventory', 'Create and approve purchase orders'),

  ('staff.view', 'staff.view', 'staff', 'View staff directory, roles, and shift attendance'),
  ('staff.create', 'staff.create', 'staff', 'Create employee logins and accounts'),
  ('staff.edit', 'staff.edit', 'staff', 'Update employee details and operational position'),
  ('staff.delete', 'staff.delete', 'staff', 'Deactivate or delete staff accounts'),
  ('staff.role.assign', 'staff.role.assign', 'staff', 'Assign or change employee operational roles'),

  ('settings.view', 'settings.view', 'settings', 'View basic restaurant configuration'),
  ('settings.edit', 'settings.edit', 'settings', 'Modify operational restaurant settings and printers'),
  ('settings.ownership', 'settings.ownership', 'settings', 'Manage business ownership and master credentials'),
  ('settings.billing', 'settings.billing', 'settings', 'Manage software subscription and payment methods'),

  ('audit.view', 'audit.view', 'audit', 'View audit trails and staff activity logs'),
  ('shift.clock', 'shift.clock', 'shifts', 'Clock in and out of operational shifts'),
  ('shift.reconcile', 'shift.reconcile', 'shifts', 'Perform cash drawer closing reconciliation')
on conflict (id) do update set
  module = excluded.module,
  description = excluded.description;

-- 4. Role-to-Permission Mapping
create table if not exists public.r8_role_permissions (
  role_id text not null references public.r8_roles(id) on delete cascade,
  permission_id text not null references public.r8_permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

-- Seed Role Permissions
-- OWNER: All permissions
insert into public.r8_role_permissions (role_id, permission_id)
select 'owner', id from public.r8_permissions
on conflict do nothing;

-- MANAGER: Broad operational, supervisor, and approval permissions
insert into public.r8_role_permissions (role_id, permission_id)
values
  ('manager', 'order.create'),
  ('manager', 'order.view'),
  ('manager', 'order.edit'),
  ('manager', 'order.cancel'),
  ('manager', 'order.cancel.approve'),
  ('manager', 'kitchen.view'),
  ('manager', 'kitchen.accept'),
  ('manager', 'kitchen.prepare'),
  ('manager', 'kitchen.complete'),
  ('manager', 'kitchen.item_toggle'),
  ('manager', 'payment.view'),
  ('manager', 'payment.collect'),
  ('manager', 'payment.refund.request'),
  ('manager', 'payment.refund.approve'),
  ('manager', 'payment.discount'),
  ('manager', 'sales.daily.view'),
  ('manager', 'sales.report.view'),
  ('manager', 'menu.view'),
  ('manager', 'menu.edit'),
  ('manager', 'inventory.view'),
  ('manager', 'inventory.edit'),
  ('manager', 'purchasing.manage'),
  ('manager', 'staff.view'),
  ('manager', 'settings.view'),
  ('manager', 'settings.edit'),
  ('manager', 'audit.view'),
  ('manager', 'shift.clock'),
  ('manager', 'shift.reconcile')
on conflict do nothing;

-- WAITER: Speed floor ordering, table status, notes
insert into public.r8_role_permissions (role_id, permission_id)
values
  ('waiter', 'order.create'),
  ('waiter', 'order.view'),
  ('waiter', 'order.edit'),
  ('waiter', 'order.cancel'),
  ('waiter', 'menu.view'),
  ('waiter', 'shift.clock')
on conflict do nothing;

-- CHEF: Kitchen Display System (KDS), preparation status
insert into public.r8_role_permissions (role_id, permission_id)
values
  ('chef', 'kitchen.view'),
  ('chef', 'kitchen.accept'),
  ('chef', 'kitchen.prepare'),
  ('chef', 'kitchen.complete'),
  ('chef', 'kitchen.item_toggle'),
  ('chef', 'order.view'),
  ('chef', 'menu.view'),
  ('chef', 'shift.clock')
on conflict do nothing;

-- CASHIER: Invoicing, payment collection, drawer reconciliation
insert into public.r8_role_permissions (role_id, permission_id)
values
  ('cashier', 'order.view'),
  ('cashier', 'payment.view'),
  ('cashier', 'payment.collect'),
  ('cashier', 'payment.refund.request'),
  ('cashier', 'payment.discount'),
  ('cashier', 'sales.daily.view'),
  ('cashier', 'menu.view'),
  ('cashier', 'shift.clock'),
  ('cashier', 'shift.reconcile')
on conflict do nothing;

-- 5. User Roles Table (Server-side ground truth for employee roles)
create table if not exists public.r8_user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.r8_workspaces(id) on delete cascade,
  branch_id uuid references public.r8_branches(id) on delete cascade,
  role_id text not null references public.r8_roles(id) on delete cascade,
  status text not null default 'active' check (status in ('active','suspended','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, workspace_id, branch_id, role_id)
);
create index if not exists r8_user_roles_user_idx on public.r8_user_roles(user_id);
create index if not exists r8_user_roles_workspace_idx on public.r8_user_roles(workspace_id);

-- 6. User Custom Permission Overrides (Grant or Deny specific actions per employee)
create table if not exists public.r8_user_permissions (
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.r8_workspaces(id) on delete cascade,
  permission_id text not null references public.r8_permissions(id) on delete cascade,
  granted boolean not null default true, -- true = grant override, false = explicit deny
  created_at timestamptz not null default now(),
  primary key (user_id, workspace_id, permission_id)
);

-- 7. Tamper-Proof Audit Logs Table
create table if not exists public.r8_audit_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.r8_workspaces(id) on delete cascade,
  branch_id uuid references public.r8_branches(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null default '',
  role_used text not null default '',
  action text not null,
  entity_type text not null,
  entity_id text not null default '',
  old_values jsonb default null,
  new_values jsonb default null,
  ip_address text default null,
  user_agent text default null,
  created_at timestamptz not null default now()
);
create index if not exists r8_audit_workspace_created_idx on public.r8_audit_logs(workspace_id, created_at desc);

-- 8. Employee Shifts Table (Clock-in/out and cash drawer tracking)
create table if not exists public.r8_shifts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.r8_workspaces(id) on delete cascade,
  branch_id uuid references public.r8_branches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id text not null references public.r8_roles(id),
  clock_in timestamptz not null default now(),
  clock_out timestamptz,
  opening_cash numeric(12,2) default 0.00,
  closing_cash numeric(12,2) default null,
  cash_collected numeric(12,2) default 0.00,
  cash_refunds numeric(12,2) default 0.00,
  expected_cash numeric(12,2) default 0.00,
  difference numeric(12,2) default 0.00,
  notes text default '',
  status text not null default 'active' check (status in ('active','closed')),
  created_at timestamptz not null default now()
);
create index if not exists r8_shifts_user_status_idx on public.r8_shifts(user_id, status);

-- ==========================================================================
-- ROW LEVEL SECURITY POLICIES
-- ==========================================================================
alter table public.r8_branches enable row level security;
alter table public.r8_roles enable row level security;
alter table public.r8_permissions enable row level security;
alter table public.r8_role_permissions enable row level security;
alter table public.r8_user_roles enable row level security;
alter table public.r8_user_permissions enable row level security;
alter table public.r8_audit_logs enable row level security;
alter table public.r8_shifts enable row level security;

-- Read grants for authenticated users
grant select on public.r8_roles, public.r8_permissions, public.r8_role_permissions to anon, authenticated;
grant select on public.r8_branches, public.r8_user_roles, public.r8_user_permissions, public.r8_shifts to authenticated;

-- Users can read their own assigned roles
create policy r8_user_reads_own_roles on public.r8_user_roles
  for select to authenticated
  using (user_id = (select auth.uid()));

-- Workspace owners and managers can read all user roles in their workspace
create policy r8_manager_reads_workspace_roles on public.r8_user_roles
  for select to authenticated
  using (
    exists (
      select 1 from public.r8_user_roles ur
      where ur.workspace_id = public.r8_user_roles.workspace_id
        and ur.user_id = (select auth.uid())
        and ur.role_id in ('owner', 'manager')
        and ur.status = 'active'
    )
    or exists (
      select 1 from public.r8_workspaces w
      where w.id = public.r8_user_roles.workspace_id
        and w.owner_id = (select auth.uid())
    )
  );

-- Only Owners can modify user roles
create policy r8_owner_manages_user_roles on public.r8_user_roles
  for all to authenticated
  using (
    exists (
      select 1 from public.r8_workspaces w
      where w.id = public.r8_user_roles.workspace_id
        and w.owner_id = (select auth.uid())
    )
  );

-- Audit logs: readable only by Owners and Managers
create policy r8_owner_reads_audit_logs on public.r8_audit_logs
  for select to authenticated
  using (
    exists (
      select 1 from public.r8_workspaces w
      where w.id = public.r8_audit_logs.workspace_id
        and w.owner_id = (select auth.uid())
    )
    or exists (
      select 1 from public.r8_user_roles ur
      where ur.workspace_id = public.r8_audit_logs.workspace_id
        and ur.user_id = (select auth.uid())
        and ur.role_id in ('owner', 'manager')
        and ur.status = 'active'
    )
  );

-- ==========================================================================
-- STORED PROCEDURES (SECURITY DEFINER)
-- ==========================================================================

-- Function: Get verified active roles for authenticated user
create or replace function public.r8_get_user_roles()
returns table (
  role_id text,
  role_name text,
  workspace_id uuid,
  branch_id uuid,
  branch_name text
)
language plpgsql security definer
set search_path = ''
as $$
declare
  caller uuid := auth.uid();
begin
  if caller is null then
    return;
  end if;

  -- 1. Check direct workspace ownership
  return query
  select
    'owner'::text as role_id,
    'Owner'::text as role_name,
    w.id as workspace_id,
    b.id as branch_id,
    coalesce(b.name, 'Main')::text as branch_name
  from public.r8_workspaces w
  left join public.r8_branches b on b.workspace_id = w.id and b.is_main = true
  where w.owner_id = caller;

  -- 2. Check assigned staff roles
  return query
  select
    ur.role_id,
    r.name as role_name,
    ur.workspace_id,
    ur.branch_id,
    coalesce(b.name, 'All Branches')::text as branch_name
  from public.r8_user_roles ur
  join public.r8_roles r on r.id = ur.role_id
  left join public.r8_branches b on b.id = ur.branch_id
  where ur.user_id = caller
    and ur.status = 'active';
end;
$$;
revoke all on function public.r8_get_user_roles() from public, anon;
grant execute on function public.r8_get_user_roles() to authenticated;

-- Function: Log tamper-proof audit event
create or replace function public.r8_log_audit(
  target_workspace_id uuid,
  target_branch_id uuid,
  log_action text,
  entity_type text,
  entity_id text default '',
  old_data jsonb default null,
  new_data jsonb default null
)
returns uuid
language plpgsql security definer
set search_path = ''
as $$
declare
  caller uuid := auth.uid();
  caller_email text := coalesce((select email from auth.users where id = caller), 'system');
  caller_role text := 'unknown';
  log_id uuid;
begin
  if caller is not null then
    select role_id into caller_role
    from public.r8_user_roles
    where user_id = caller and workspace_id = target_workspace_id and status = 'active'
    order by created_at desc limit 1;

    if caller_role is null and exists (select 1 from public.r8_workspaces where id = target_workspace_id and owner_id = caller) then
      caller_role := 'owner';
    end if;
  end if;

  insert into public.r8_audit_logs (
    workspace_id, branch_id, user_id, user_email, role_used,
    action, entity_type, entity_id, old_values, new_values
  ) values (
    target_workspace_id, target_branch_id, caller, caller_email, coalesce(caller_role, 'unknown'),
    log_action, entity_type, entity_id, old_data, new_data
  ) returning id into log_id;

  return log_id;
end;
$$;
revoke all on function public.r8_log_audit(uuid, uuid, text, text, text, jsonb, jsonb) from public, anon;
grant execute on function public.r8_log_audit(uuid, uuid, text, text, text, jsonb, jsonb) to authenticated;
