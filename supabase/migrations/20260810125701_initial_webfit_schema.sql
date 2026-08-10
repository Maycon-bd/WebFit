-- WebFit initial multi-clinic schema.
-- All exposed tables use RLS. The browser must only use a publishable key.
-- Applied to the WEBFIT project as migration 20260810125701.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.clinic_member_role as enum ('owner', 'nutritionist', 'assistant');
create type public.appointment_status as enum ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
create type public.appointment_mode as enum ('in_person', 'online');
create type public.financial_status as enum ('pending', 'paid', 'cancelled', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  professional_license text,
  phone text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clinic_members (
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.clinic_member_role not null default 'nutritionist',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (clinic_id, user_id)
);

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  full_name text not null check (char_length(full_name) between 2 and 160),
  preferred_name text,
  email text,
  phone text,
  document_number text,
  birth_date date,
  gender text,
  tags text[] not null default '{}',
  clinical_notes text,
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete restrict,
  professional_id uuid not null references auth.users(id) on delete restrict,
  starts_at timestamptz not null,
  duration_minutes smallint not null default 60 check (duration_minutes between 10 and 480),
  mode public.appointment_mode not null default 'in_person',
  status public.appointment_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete restrict,
  author_id uuid not null references auth.users(id) on delete restrict,
  title text not null check (char_length(title) between 2 and 160),
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.anthropometry_entries (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  recorded_by uuid not null references auth.users(id) on delete restrict,
  measured_at timestamptz not null default now(),
  weight_kg numeric(6,2) check (weight_kg > 0 and weight_kg < 1000),
  height_cm numeric(5,2) check (height_cm > 0 and height_cm < 300),
  body_fat_percentage numeric(5,2) check (body_fat_percentage between 0 and 100),
  measurements jsonb not null default '{}'::jsonb check (jsonb_typeof(measurements) = 'object'),
  created_at timestamptz not null default now()
);

create table public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete restrict,
  client_name text not null check (char_length(client_name) between 2 and 160),
  amount numeric(12,2) not null check (amount > 0),
  payment_method text not null,
  status public.financial_status not null default 'paid',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.planner_tasks (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  assignee_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 240),
  due_date date not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clinic_id, patient_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete restrict,
  body text not null check (char_length(body) between 1 and 10000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Foreign-key and common query indexes.
create index clinics_owner_id_idx on public.clinics(owner_id);
create index clinic_members_user_id_idx on public.clinic_members(user_id, active);
create index patients_clinic_updated_idx on public.patients(clinic_id, updated_at desc);
create index patients_created_by_idx on public.patients(created_by);
create index appointments_clinic_starts_idx on public.appointments(clinic_id, starts_at);
create index appointments_patient_id_idx on public.appointments(patient_id);
create index appointments_professional_id_idx on public.appointments(professional_id);
create index prescriptions_clinic_issued_idx on public.prescriptions(clinic_id, issued_at desc);
create index prescriptions_patient_id_idx on public.prescriptions(patient_id);
create index prescriptions_author_id_idx on public.prescriptions(author_id);
create index anthropometry_patient_measured_idx on public.anthropometry_entries(patient_id, measured_at desc);
create index anthropometry_clinic_id_idx on public.anthropometry_entries(clinic_id);
create index anthropometry_recorded_by_idx on public.anthropometry_entries(recorded_by);
create index financial_clinic_created_idx on public.financial_transactions(clinic_id, created_at desc);
create index financial_patient_id_idx on public.financial_transactions(patient_id);
create index financial_created_by_idx on public.financial_transactions(created_by);
create index planner_assignee_due_idx on public.planner_tasks(assignee_id, due_date);
create index planner_clinic_id_idx on public.planner_tasks(clinic_id);
create index conversations_patient_id_idx on public.conversations(patient_id);
create index messages_conversation_created_idx on public.messages(conversation_id, created_at);
create index messages_clinic_id_idx on public.messages(clinic_id);
create index messages_sender_id_idx on public.messages(sender_id);
create index notifications_recipient_created_idx on public.notifications(recipient_id, created_at desc);
create index notifications_clinic_id_idx on public.notifications(clinic_id);
create index audit_logs_clinic_created_idx on public.audit_logs(clinic_id, created_at desc);
create index audit_logs_actor_id_idx on public.audit_logs(actor_id);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''));
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
  insert into public.clinic_members (clinic_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function private.set_updated_at();
create trigger clinics_updated_at before update on public.clinics
for each row execute function private.set_updated_at();
create trigger patients_updated_at before update on public.patients
for each row execute function private.set_updated_at();
create trigger appointments_updated_at before update on public.appointments
for each row execute function private.set_updated_at();
create trigger prescriptions_updated_at before update on public.prescriptions
for each row execute function private.set_updated_at();
create trigger financial_updated_at before update on public.financial_transactions
for each row execute function private.set_updated_at();
create trigger planner_updated_at before update on public.planner_tasks
for each row execute function private.set_updated_at();
create trigger conversations_updated_at before update on public.conversations
for each row execute function private.set_updated_at();
create trigger on_auth_user_created after insert on auth.users
for each row execute function private.handle_new_user();
create trigger on_clinic_created after insert on public.clinics
for each row execute function private.add_clinic_owner_membership();

alter table public.profiles enable row level security;
alter table public.clinics enable row level security;
alter table public.clinic_members enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.prescriptions enable row level security;
alter table public.anthropometry_entries enable row level security;
alter table public.financial_transactions enable row level security;
alter table public.planner_tasks enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_select_own on public.profiles for select to authenticated
using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy clinic_members_select_own on public.clinic_members for select to authenticated
using (user_id = (select auth.uid()));
create policy clinic_members_owner_insert on public.clinic_members for insert to authenticated
with check (exists (
  select 1 from public.clinics c
  where c.id = clinic_id and c.owner_id = (select auth.uid())
));
create policy clinic_members_owner_update on public.clinic_members for update to authenticated
using (exists (
  select 1 from public.clinics c
  where c.id = clinic_id and c.owner_id = (select auth.uid())
)) with check (exists (
  select 1 from public.clinics c
  where c.id = clinic_id and c.owner_id = (select auth.uid())
));
create policy clinic_members_owner_delete on public.clinic_members for delete to authenticated
using (user_id <> (select auth.uid()) and exists (
  select 1 from public.clinics c
  where c.id = clinic_id and c.owner_id = (select auth.uid())
));

create policy clinics_select_member on public.clinics for select to authenticated
using (exists (
  select 1 from public.clinic_members cm
  where cm.clinic_id = id and cm.user_id = (select auth.uid()) and cm.active
));
create policy clinics_insert_owner on public.clinics for insert to authenticated
with check (owner_id = (select auth.uid()));
create policy clinics_update_owner on public.clinics for update to authenticated
using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

-- Tenant policies. The user must hold an active membership in the row's clinic.
create policy patients_member_all on public.patients for all to authenticated
using (exists (select 1 from public.clinic_members cm where cm.clinic_id = patients.clinic_id and cm.user_id = (select auth.uid()) and cm.active))
with check (exists (select 1 from public.clinic_members cm where cm.clinic_id = patients.clinic_id and cm.user_id = (select auth.uid()) and cm.active));
create policy appointments_member_all on public.appointments for all to authenticated
using (exists (select 1 from public.clinic_members cm where cm.clinic_id = appointments.clinic_id and cm.user_id = (select auth.uid()) and cm.active))
with check (exists (select 1 from public.clinic_members cm where cm.clinic_id = appointments.clinic_id and cm.user_id = (select auth.uid()) and cm.active));
create policy prescriptions_member_all on public.prescriptions for all to authenticated
using (exists (select 1 from public.clinic_members cm where cm.clinic_id = prescriptions.clinic_id and cm.user_id = (select auth.uid()) and cm.active))
with check (exists (select 1 from public.clinic_members cm where cm.clinic_id = prescriptions.clinic_id and cm.user_id = (select auth.uid()) and cm.active));
create policy anthropometry_member_all on public.anthropometry_entries for all to authenticated
using (exists (select 1 from public.clinic_members cm where cm.clinic_id = anthropometry_entries.clinic_id and cm.user_id = (select auth.uid()) and cm.active))
with check (exists (select 1 from public.clinic_members cm where cm.clinic_id = anthropometry_entries.clinic_id and cm.user_id = (select auth.uid()) and cm.active));
create policy financial_member_all on public.financial_transactions for all to authenticated
using (exists (select 1 from public.clinic_members cm where cm.clinic_id = financial_transactions.clinic_id and cm.user_id = (select auth.uid()) and cm.active))
with check (exists (select 1 from public.clinic_members cm where cm.clinic_id = financial_transactions.clinic_id and cm.user_id = (select auth.uid()) and cm.active));
create policy planner_member_all on public.planner_tasks for all to authenticated
using (exists (select 1 from public.clinic_members cm where cm.clinic_id = planner_tasks.clinic_id and cm.user_id = (select auth.uid()) and cm.active))
with check (exists (select 1 from public.clinic_members cm where cm.clinic_id = planner_tasks.clinic_id and cm.user_id = (select auth.uid()) and cm.active));
create policy conversations_member_all on public.conversations for all to authenticated
using (exists (select 1 from public.clinic_members cm where cm.clinic_id = conversations.clinic_id and cm.user_id = (select auth.uid()) and cm.active))
with check (exists (select 1 from public.clinic_members cm where cm.clinic_id = conversations.clinic_id and cm.user_id = (select auth.uid()) and cm.active));
create policy messages_member_all on public.messages for all to authenticated
using (exists (select 1 from public.clinic_members cm where cm.clinic_id = messages.clinic_id and cm.user_id = (select auth.uid()) and cm.active))
with check (exists (select 1 from public.clinic_members cm where cm.clinic_id = messages.clinic_id and cm.user_id = (select auth.uid()) and cm.active));
create policy notifications_recipient_select on public.notifications for select to authenticated
using (recipient_id = (select auth.uid()) and exists (select 1 from public.clinic_members cm where cm.clinic_id = notifications.clinic_id and cm.user_id = (select auth.uid()) and cm.active));
create policy notifications_recipient_update on public.notifications for update to authenticated
using (recipient_id = (select auth.uid())) with check (recipient_id = (select auth.uid()));
create policy audit_logs_member_select on public.audit_logs for select to authenticated
using (exists (select 1 from public.clinic_members cm where cm.clinic_id = audit_logs.clinic_id and cm.user_id = (select auth.uid()) and cm.active));

revoke all on all tables in schema public from anon;
grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.clinics to authenticated;
grant select, insert, update, delete on public.clinic_members to authenticated;
grant select, insert, update, delete on public.patients, public.appointments, public.prescriptions,
  public.anthropometry_entries, public.financial_transactions, public.planner_tasks,
  public.conversations, public.messages to authenticated;
grant select, update on public.notifications to authenticated;
grant select on public.audit_logs to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'clinical-files',
  'clinical-files',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

create policy clinical_files_member_select on storage.objects for select to authenticated
using (bucket_id = 'clinical-files' and exists (
  select 1 from public.clinic_members cm
  where cm.clinic_id::text = (storage.foldername(name))[1]
    and cm.user_id = (select auth.uid()) and cm.active
));
create policy clinical_files_member_insert on storage.objects for insert to authenticated
with check (bucket_id = 'clinical-files' and owner_id = (select auth.uid()::text) and exists (
  select 1 from public.clinic_members cm
  where cm.clinic_id::text = (storage.foldername(name))[1]
    and cm.user_id = (select auth.uid()) and cm.active
));
create policy clinical_files_owner_update on storage.objects for update to authenticated
using (bucket_id = 'clinical-files' and owner_id = (select auth.uid()::text))
with check (bucket_id = 'clinical-files' and owner_id = (select auth.uid()::text));
create policy clinical_files_owner_delete on storage.objects for delete to authenticated
using (bucket_id = 'clinical-files' and owner_id = (select auth.uid()::text));

alter publication supabase_realtime add table public.messages, public.notifications;
