-- Complete the hard-delete lockdown for every exposed business table.
revoke delete on public.profiles, public.clinics, public.clinic_members,
  public.patients, public.appointments, public.prescriptions,
  public.anthropometry_entries, public.financial_transactions,
  public.planner_tasks, public.conversations, public.messages,
  public.notifications, public.audit_logs from authenticated;
