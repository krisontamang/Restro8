-- Rollback-only account/RLS integration checks. No emails, charges or retained users.
begin;
select set_config('r8test.owner_a',gen_random_uuid()::text,true), set_config('r8test.owner_b',gen_random_uuid()::text,true), set_config('r8test.unverified',gen_random_uuid()::text,true);
insert into auth.users(id,email,email_confirmed_at,is_anonymous)
values
(current_setting('r8test.owner_a')::uuid, current_setting('r8test.owner_a') || '@example.invalid', now(), false),
(current_setting('r8test.owner_b')::uuid, current_setting('r8test.owner_b') || '@example.invalid', now(), false),
(current_setting('r8test.unverified')::uuid, current_setting('r8test.unverified') || '@example.invalid', null, false);
insert into public.r8_billing_plans(id,name,currency,amount_minor,interval,active) values
('r8-rollback-test-visible','Rollback test','NPR',100,'month',true),
('r8-rollback-test-hidden','Rollback test','NPR',100,'month',false);
select set_config('request.jwt.claims', json_build_object('sub',current_setting('r8test.owner_a'),'role','authenticated')::text,true);
set local role authenticated;
select set_config('r8test.workspace_a',public.r8_create_workspace('Rollback restaurant A')::text,true);
do $$ begin
 if public.r8_create_workspace('Repeated name')::text <> current_setting('r8test.workspace_a') then raise exception 'FAIL: duplicate workspace'; end if;
 if (select count(*) from public.r8_workspaces) <> 1 then raise exception 'FAIL: own workspace missing'; end if;
 if not exists(select 1 from public.r8_memberships where role='owner' and user_id=auth.uid()) then raise exception 'FAIL: atomic membership'; end if;
 begin
   update public.r8_memberships set role='manager' where user_id=auth.uid();
   raise exception 'FAIL: client may change roles';
 exception when insufficient_privilege then null; end;
 begin
   insert into public.r8_subscriptions(workspace_id,status) values(current_setting('r8test.workspace_a')::uuid,'pending');
   raise exception 'FAIL: client may write subscription';
 exception when insufficient_privilege then null; end;
 begin
   perform public.r8_create_workspace('x');
   raise exception 'FAIL: invalid name accepted';
 exception when invalid_parameter_value then null; end;
end $$;
reset role;
insert into public.r8_subscriptions(workspace_id,status) values(current_setting('r8test.workspace_a')::uuid,'pending');
select set_config('request.jwt.claims',json_build_object('sub',current_setting('r8test.owner_b'),'role','authenticated')::text,true);
set local role authenticated;
do $$ begin
 if exists(select 1 from public.r8_workspaces) then raise exception 'FAIL: cross-tenant workspace read'; end if;
 if exists(select 1 from public.r8_subscriptions) then raise exception 'FAIL: cross-tenant subscription read'; end if;
 if exists(select 1 from public.r8_memberships) then raise exception 'FAIL: cross-tenant membership read'; end if;
 perform public.r8_create_workspace('Rollback restaurant B');
 if (select count(*) from public.r8_workspaces) <> 1 then raise exception 'FAIL: tenant B isolation'; end if;
end $$;
reset role;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('r8test.unverified'),'role','authenticated')::text,true);
set local role authenticated;
do $$ begin
 begin
  perform public.r8_create_workspace('Unverified restaurant');
  raise exception 'FAIL: unverified user created workspace';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claims','{"role":"anon"}',true);
set local role anon;
do $$ begin
 if not exists(select 1 from public.r8_billing_plans where id='r8-rollback-test-visible') then raise exception 'FAIL: published pricing hidden'; end if;
 if exists(select 1 from public.r8_billing_plans where id='r8-rollback-test-hidden') then raise exception 'FAIL: draft pricing leaked'; end if;
 begin
  perform public.r8_create_workspace('Anonymous restaurant');
  raise exception 'FAIL: anonymous workspace creation';
 exception when insufficient_privilege then null; end;
 begin
  perform id from public.r8_workspaces;
  raise exception 'FAIL: anonymous workspace read';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
select 'PASS: 15 account/RLS assertions; transaction rolled back, no retained test accounts or orders' as result;
rollback;
