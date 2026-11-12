-- Final setup: browser subscribers can READ server-authenticated broadcasts only.
-- The lucky-sanctuary-event Edge Function is the sole publisher; no client INSERT policy.
create policy "lucky_sanctuary_members_receive_v320" on realtime.messages for select to authenticated using ((select realtime.topic()) = 'lucky-sanctuary-v320' and extension = 'broadcast' and (select auth.uid()) is not null and coalesce((select auth.jwt())->>'is_anonymous','false') <> 'true');
-- Existing project was updated additively through the recorded v320 migrations.
