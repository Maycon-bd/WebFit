import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260810125701_initial_webfit_schema.sql'),
  'utf8',
);
const auditMigration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260810134731_audit_soft_delete.sql'),
  'utf8',
);
const deleteLockdownMigration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260810134921_complete_delete_lockdown.sql'),
  'utf8',
);
const indexMigration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260810135148_index_audit_foreign_keys.sql'),
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

  it('standardizes authorship and logical deletion fields', () => {
    expect(auditMigration).toContain('add column updated_by uuid');
    expect(auditMigration).toContain('add column deleted_at timestamptz');
    expect(auditMigration).toContain('add column deleted_by uuid');
    expect(auditMigration).toContain('private.set_audit_fields()');
  });

  it('automatically records changes and prevents browser hard deletes', () => {
    expect(auditMigration).toContain('private.write_audit_log()');
    expect(auditMigration).toContain("audit_action := 'HARD_DELETE'");
    expect(auditMigration).toContain('revoke delete on public.clinic_members');
    expect(auditMigration).toContain('as restrictive for select to authenticated');
  });

  it('locks down hard deletes for every exposed business table', () => {
    for (const table of exposedTables) {
      expect(deleteLockdownMigration).toMatch(new RegExp(
        `revoke\\s+delete\\s+on[\\s\\S]*?public\\.${table}(?:[\\s,]|$)`,
        'i',
      ));
    }
  });

  it('hardens every security-definer function and revokes direct execution', () => {
    const definerFunctions = [
      'write_audit_log', 'cascade_patient_soft_delete',
      'handle_new_user', 'add_clinic_owner_membership',
    ];

    for (const functionName of definerFunctions) {
      expect(auditMigration).toMatch(new RegExp(
        `function private\\.${functionName}\\(\\)[\\s\\S]*?security definer[\\s\\S]*?set search_path = ''`,
        'i',
      ));
      expect(auditMigration).toContain(
        `revoke execute on function private.${functionName}() from public, anon, authenticated;`,
      );
    }
  });

  it('does not authorize from user-editable metadata', () => {
    expect(`${migration}\n${auditMigration}`).not.toMatch(/raw_user_meta_data[\s\S]{0,200}(role|permission)/i);
    expect(`${migration}\n${auditMigration}`).not.toContain('auth.jwt() -> \'user_metadata\'');
  });

  it('indexes audit actor foreign keys used for traceability', () => {
    const allMigrations = `${migration}\n${indexMigration}`;
    const auditedTables = [
      'anthropometry_entries', 'appointments', 'clinic_members', 'clinics',
      'conversations', 'messages', 'notifications', 'patients', 'planner_tasks',
      'prescriptions', 'profiles',
    ];
    for (const table of auditedTables) {
      for (const field of ['created_by', 'updated_by', 'deleted_by']) {
        expect(allMigrations).toContain(`on public.${table}(${field});`);
      }
    }
  });
});
