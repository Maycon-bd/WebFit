import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260810122449_initial_webfit_schema.sql'),
  'utf8',
);

describe('Supabase security baseline', () => {
  const exposedTables = [
    'profiles', 'clinics', 'clinic_members', 'patients', 'appointments',
    'prescriptions', 'anthropometry_entries', 'financial_transactions',
    'planner_tasks', 'conversations', 'messages', 'notifications', 'audit_logs',
  ];

  it.each(exposedTables)('enables RLS for %s', (table) => {
    expect(migration).toContain(`alter table public.${table} enable row level security;`);
  });

  it('does not rely on deprecated role checks or expose service keys', () => {
    expect(migration).not.toContain('auth.role()');
    expect(migration).not.toContain('service_role');
  });

  it('keeps clinical files private and size restricted', () => {
    expect(migration).toContain("'clinical-files'");
    expect(migration).toContain('false,');
    expect(migration).toContain('10485760');
  });
});
