
begin;
create temp table lucky_owner_fixture as select id as owner_id, gen_random_uuid() as stranger_id from auth.users limit 1;
grant select on lucky_owner_fixture to authenticated;
do $$ begin if not exists(select 1 from lucky_owner_fixture) then raise exception 'No owner available for rollback-only RLS test'; end if; end $$;
insert into public.lucky_member_profiles(user_id,display_name) select owner_id,'RLS_TEST' from lucky_owner_fixture on conflict do nothing;
set local role authenticated;
select set_config('request.jwt.claims',(select json_build_object('sub',owner_id,'role','authenticated','is_anonymous',false)::text from lucky_owner_fixture),true);
do $$
declare owner_id uuid; stranger_id uuid; test_id uuid; affected integer;
begin
 select f.owner_id,f.stranger_id into owner_id,stranger_id from lucky_owner_fixture f;
 insert into public.lucky_member_draws(user_id,number,player_name) values(owner_id,'001','RLS_TEST') returning id into test_id;
 insert into public.lucky_member_keeps(user_id,leaf_id) values(owner_id,28) on conflict do nothing;
 if not exists(select 1 from public.lucky_member_draws where id=test_id) then raise exception 'Owner cannot read own draw';end if;
 if not exists(select 1 from public.lucky_member_profiles p where p.user_id=owner_id) then raise exception 'Owner cannot read own profile';end if;
 if not exists(select 1 from public.lucky_member_keeps k where k.user_id=owner_id and leaf_id=28) then raise exception 'Owner cannot read own keep';end if;
 perform set_config('request.jwt.claims',json_build_object('sub',stranger_id,'role','authenticated','is_anonymous',false)::text,true);
 if exists(select 1 from public.lucky_member_draws where id=test_id) then raise exception 'Cross-owner draw leak';end if;
 if exists(select 1 from public.lucky_member_profiles p where p.user_id=owner_id) then raise exception 'Cross-owner profile leak';end if;
 if exists(select 1 from public.lucky_member_keeps k where k.user_id=owner_id) then raise exception 'Cross-owner keep leak';end if;
 begin
  insert into public.lucky_member_draws(user_id,number,player_name) values(owner_id,'99','FORGED');
  raise exception 'Forged owner insert accepted';
 exception when insufficient_privilege then null;
 end;
 update public.lucky_member_profiles p set display_name='FORGED' where p.user_id=owner_id;
 get diagnostics affected=row_count;if affected<>0 then raise exception 'Cross-owner update accepted';end if;
 delete from public.lucky_member_draws where id=test_id;
 get diagnostics affected=row_count;if affected<>0 then raise exception 'Cross-owner delete accepted';end if;
end $$;
rollback;
select true as ownership_isolation_test_passed, true as test_data_rolled_back;

