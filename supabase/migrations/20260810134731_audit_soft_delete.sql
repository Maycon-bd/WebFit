-- Complete record provenance and logical deletion for WebFit.
-- The authenticated API can archive records, but cannot physically delete them.

alter table public.audit_logs alter column clinic_id drop not null;

alter table public.profiles
  add column created_by uuid references auth.users(id) on delete restrict,
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

alter table public.clinics
  add column created_by uuid references auth.users(id) on delete restrict,
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

alter table public.clinic_members
  add column updated_at timestamptz not null default now(),
  add column created_by uuid references auth.users(id) on delete restrict,
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

alter table public.patients
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

alter table public.appointments
  add column created_by uuid references auth.users(id) on delete restrict,
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

alter table public.prescriptions
  add column created_by uuid references auth.users(id) on delete restrict,
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

alter table public.anthropometry_entries
  add column updated_at timestamptz not null default now(),
  add column created_by uuid references auth.users(id) on delete restrict,
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

alter table public.financial_transactions
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

alter table public.planner_tasks
  add column created_by uuid references auth.users(id) on delete restrict,
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

alter table public.conversations
  add column created_by uuid references auth.users(id) on delete restrict,
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

alter table public.messages
  add column updated_at timestamptz not null default now(),
  add column created_by uuid references auth.users(id) on delete restrict,
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

alter table public.notifications
  add column updated_at timestamptz not null default now(),
  add column created_by uuid references auth.users(id) on delete restrict,
  add column updated_by uuid references auth.users(id) on delete restrict,
  add column deleted_at timestamptz,
  add column deleted_by uuid references auth.users(id) on delete restrict;

-- Backfill provenance from the actor columns that existed in the initial schema.
update public.profiles set created_by = id where created_by is null;
update public.clinics set created_by = owner_id where created_by is null;
update public.clinic_members set created_by = user_id where created_by is null;
update public.appointments set created_by = professional_id where created_by is null;
update public.prescriptions set created_by = author_id where created_by is null;
update public.anthropometry_entries set created_by = recorded_by where created_by is null;
update public.planner_tasks set created_by = assignee_id where created_by is null;
update public.conversations c
set created_by = p.created_by
from public.patients p
where p.id = c.patient_id and c.created_by is null;
update public.messages set created_by = sender_id where created_by is null;
update public.notifications set created_by = recipient_id where created_by is null;

alter table public.profiles alter column created_by set not null;
alter table public.clinics alter column created_by set not null;
alter table public.clinic_members alter column created_by set not null;
alter table public.appointments alter column created_by set not null;
alter table public.prescriptions alter column created_by set not null;
alter table public.anthropometry_entries alter column created_by set not null;
alter table public.planner_tasks alter column created_by set not null;
alter table public.conversations alter column created_by set not null;
alter table public.messages alter column created_by set not null;
alter table public.notifications alter column created_by set not null;

alter table public.clinic_members
  add constraint clinic_members_deleted_inactive_check
  check (deleted_at is null or active = false);

create or replace function private.set_audit_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  current_actor uuid := (select auth.uid());
begin
  if tg_op = 'INSERT' then
    new.created_at := coalesce(new.created_at, now());
    new.updated_at := coalesce(new.updated_at, new.created_at);
    if current_actor is not null then
      new.created_by := current_actor;
      new.updated_by := current_actor;
    else
      new.updated_by := coalesce(new.updated_by, new.created_by);
    end if;
    new.deleted_by := case when new.deleted_at is null then null else coalesce(current_actor, new.deleted_by) end;
  else
    new.created_at := old.created_at;
    new.created_by := old.created_by;
    new.updated_at := now();
    new.updated_by := coalesce(current_actor, new.updated_by, old.updated_by, old.created_by);

    if old.deleted_at is null and new.deleted_at is not null then
      new.deleted_by := coalesce(current_actor, new.deleted_by, new.updated_by);
    elsif old.deleted_at is not null and new.deleted_at is null then
      new.deleted_by := null;
    else
      new.deleted_at := old.deleted_at;
      new.deleted_by := old.deleted_by;
    end if;
  end if;
  return new;
end;
$$;

create or replace function private.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_row jsonb := case when tg_op = 'INSERT' then '{}'::jsonb else to_jsonb(old) end;
  new_row jsonb := case when tg_op = 'DELETE' then '{}'::jsonb else to_jsonb(new) end;
  audit_row jsonb := case when tg_op = 'DELETE' then old_row else new_row end;
  audit_action text;
  audit_actor uuid;
  audit_clinic uuid;
  audit_entity_id text;
  changed_fields jsonb := '[]'::jsonb;
begin
  if tg_op = 'INSERT' then
    audit_action := 'CREATE';
  elsif tg_op = 'DELETE' then
    audit_action := 'HARD_DELETE';
  elsif old_row ->> 'deleted_at' is null and new_row ->> 'deleted_at' is not null then
    audit_action := 'DELETE';
  elsif old_row ->> 'deleted_at' is not null and new_row ->> 'deleted_at' is null then
    audit_action := 'RESTORE';
  else
    audit_action := 'UPDATE';
  end if;

  audit_actor := coalesce(
    (select auth.uid()),
    nullif(audit_row ->> 'deleted_by', '')::uuid,
    nullif(audit_row ->> 'updated_by', '')::uuid,
    nullif(audit_row ->> 'created_by', '')::uuid
  );
  audit_clinic := case
    when tg_table_name = 'clinics' then nullif(audit_row ->> 'id', '')::uuid
    else nullif(audit_row ->> 'clinic_id', '')::uuid
  end;
  audit_entity_id := case
    when tg_table_name = 'clinic_members' then concat(audit_row ->> 'clinic_id', ':', audit_row ->> 'user_id')
    else audit_row ->> 'id'
  end;

  if tg_op = 'UPDATE' then
    select coalesce(jsonb_agg(field_name order by field_name), '[]'::jsonb)
      into changed_fields
    from (
      select n.key as field_name
      from jsonb_each(new_row) n
      where n.value is distinct from old_row -> n.key
        and n.key not in ('updated_at', 'updated_by')
    ) changes;
  end if;

  insert into public.audit_logs (clinic_id, actor_id, action, entity_type, entity_id, metadata)
  values (
    audit_clinic,
    audit_actor,
    audit_action,
    tg_table_name,
    audit_entity_id,
    jsonb_build_object(
      'changed_fields', changed_fields,
      'actor_reference', audit_actor,
      'occurred_via', 'database_trigger'
    )
  );
  return null;
end;
$$;

-- Soft-deleting a patient also archives their dependent clinical history.
-- Financial transactions remain visible for accounting retention.
create or replace function private.cascade_patient_soft_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.deleted_at is null and new.deleted_at is not null then
    update public.appointments set deleted_at = new.deleted_at where patient_id = new.id and deleted_at is null;
    update public.prescriptions set deleted_at = new.deleted_at where patient_id = new.id and deleted_at is null;
    update public.anthropometry_entries set deleted_at = new.deleted_at where patient_id = new.id and deleted_at is null;
    update public.messages m
      set deleted_at = new.deleted_at
      from public.conversations c
      where c.patient_id = new.id and m.conversation_id = c.id and m.deleted_at is null;
    update public.conversations set deleted_at = new.deleted_at where patient_id = new.id and deleted_at is null;
  end if;
  return null;
end;
$$;

-- Retire the original timestamp-only triggers.
drop trigger if exists profiles_updated_at on public.profiles;
drop trigger if exists clinics_updated_at on public.clinics;
drop trigger if exists patients_updated_at on public.patients;
drop trigger if exists appointments_updated_at on public.appointments;
drop trigger if exists prescriptions_updated_at on public.prescriptions;
drop trigger if exists financial_updated_at on public.financial_transactions;
drop trigger if exists planner_updated_at on public.planner_tasks;
drop trigger if exists conversations_updated_at on public.conversations;
drop function if exists private.set_updated_at();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'clinics', 'clinic_members', 'patients', 'appointments', 'prescriptions',
    'anthropometry_entries', 'financial_transactions', 'planner_tasks', 'conversations',
    'messages', 'notifications'
  ] loop
    execute format(
      'create trigger %I before insert or update on public.%I for each row execute function private.set_audit_fields()',
      table_name || '_audit_fields', table_name
    );
    execute format(
      'create trigger %I after insert or update or delete on public.%I for each row execute function private.write_audit_log()',
      table_name || '_audit_log', table_name
    );
  end loop;
end;
$$;

create trigger patients_cascade_soft_delete
after update of deleted_at on public.patients
for each row execute function private.cascade_patient_soft_delete();

-- System-created rows still receive an explicit creator.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, created_by)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''), new.id);
  return new;
end;
$$;

create or replace function private.add_clinic_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.owner_id is distinct from (select auth.uid()) then
    raise exception 'clinic owner must match authenticated user';
  end if;
  insert into public.clinic_members (clinic_id, user_id, role, created_by)
  values (new.id, new.owner_id, 'owner', new.owner_id);
  return new;
end;
$$;

-- Restrictive SELECT policies hide archived rows while preserving UPDATE-based archiving.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'clinics', 'clinic_members', 'patients', 'appointments', 'prescriptions',
    'anthropometry_entries', 'financial_transactions', 'planner_tasks', 'conversations',
    'messages', 'notifications'
  ] loop
    execute format(
      'create policy %I on public.%I as restrictive for select to authenticated using (deleted_at is null)',
      table_name || '_active_rows', table_name
    );
  end loop;
end;
$$;

-- A logically removed member must immediately lose tenant access.
create or replace function private.deactivate_deleted_membership()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.deleted_at is null and new.deleted_at is not null then
    new.active := false;
  end if;
  return new;
end;
$$;

create trigger clinic_members_deactivate_on_delete
before update of deleted_at on public.clinic_members
for each row execute function private.deactivate_deleted_membership();

drop policy audit_logs_member_select on public.audit_logs;
create policy audit_logs_member_select on public.audit_logs for select to authenticated
using (
  actor_id = (select auth.uid())
  or exists (
    select 1 from public.clinic_members cm
    where cm.clinic_id = audit_logs.clinic_id
      and cm.user_id = (select auth.uid())
      and cm.active
      and cm.deleted_at is null
  )
);

-- Partial indexes match the active-row queries issued by the application.
create index patients_active_clinic_updated_idx
  on public.patients(clinic_id, updated_at desc) where deleted_at is null;
create index appointments_active_clinic_starts_idx
  on public.appointments(clinic_id, starts_at) where deleted_at is null;
create index prescriptions_active_patient_issued_idx
  on public.prescriptions(patient_id, issued_at desc) where deleted_at is null;
create index anthropometry_active_patient_measured_idx
  on public.anthropometry_entries(patient_id, measured_at desc) where deleted_at is null;
create index financial_active_clinic_created_idx
  on public.financial_transactions(clinic_id, created_at desc) where deleted_at is null;
create index planner_active_assignee_due_idx
  on public.planner_tasks(assignee_id, due_date) where deleted_at is null;
create index messages_active_conversation_created_idx
  on public.messages(conversation_id, created_at) where deleted_at is null;
create index notifications_active_recipient_created_idx
  on public.notifications(recipient_id, created_at desc) where deleted_at is null;

-- Browser users can only archive through UPDATE. Hard deletion remains an explicit
-- administrative operation and is captured as HARD_DELETE by the audit trigger.
revoke delete on public.clinic_members, public.patients, public.appointments,
  public.prescriptions, public.anthropometry_entries, public.financial_transactions,
  public.planner_tasks, public.conversations, public.messages from authenticated;
revoke insert, update, delete, truncate on public.audit_logs from anon, authenticated;

revoke execute on function private.set_audit_fields() from public, anon, authenticated;
revoke execute on function private.write_audit_log() from public, anon, authenticated;
revoke execute on function private.cascade_patient_soft_delete() from public, anon, authenticated;
revoke execute on function private.deactivate_deleted_membership() from public, anon, authenticated;
revoke execute on function private.handle_new_user() from public, anon, authenticated;
revoke execute on function private.add_clinic_owner_membership() from public, anon, authenticated;
