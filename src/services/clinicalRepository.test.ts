import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Patient } from '../types';

const state = vi.hoisted(() => ({ client: null as unknown }));

vi.mock('../lib/supabase', () => ({
  get supabase() {
    return state.client;
  },
}));

import {
  cancelAppointmentRecord,
  createAppointment,
  createPatient,
  deletePatientRecord,
  listAppointments,
  listPatients,
  updatePatientRecord,
} from './clinicalRepository';

type Result = { data?: unknown; error?: unknown };

const query = (result: Result) => {
  const builder = {
    select: vi.fn(), eq: vi.fn(), is: vi.fn(), order: vi.fn(),
    insert: vi.fn(), update: vi.fn(), single: vi.fn(),
    then: (resolve: (value: Result) => unknown) => Promise.resolve(result).then(resolve),
  };
  for (const method of ['select', 'eq', 'is', 'order', 'insert', 'update'] as const) {
    builder[method].mockReturnValue(builder);
  }
  builder.single.mockResolvedValue(result);
  return builder;
};

const patientRow = {
  id: 'p1', full_name: 'Ana Silva', preferred_name: null, document_number: null,
  phone: null, email: null, gender: null, birth_date: null, tags: ['retorno'],
  updated_at: '2026-08-13T15:30:00.000Z', clinical_notes: null, status: 'active',
};

const patientInput: Omit<Patient, 'id' | 'lastModified' | 'status'> = {
  name: ' Ana Silva ', nickname: ' ', cpf: ' ', phone: ' 11999999999 ',
  email: ' ana@example.com ', gender: '', birthDate: '', tags: ['retorno'], notes: ' ',
};

describe('clinical repository', () => {
  beforeEach(() => {
    state.client = null;
  });

  it('fails clearly when Supabase is not configured', async () => {
    await expect(listPatients('clinic-1')).rejects.toThrow('Supabase não configurado.');
  });

  it('lists active patients and maps nullable database fields', async () => {
    const builder = query({ data: [patientRow], error: null });
    state.client = { from: vi.fn(() => builder) };

    const patients = await listPatients('clinic-1');

    expect(patients[0]).toEqual(expect.objectContaining({
      id: 'p1', name: 'Ana Silva', nickname: '', cpf: '', status: 'Ativo', notes: '',
    }));
    expect(builder.eq).toHaveBeenCalledWith('clinic_id', 'clinic-1');
    expect(builder.is).toHaveBeenCalledWith('deleted_at', null);
    expect(builder.order).toHaveBeenCalledWith('updated_at', { ascending: false });
  });

  it('normalizes optional patient fields before insertion', async () => {
    const builder = query({ data: patientRow, error: null });
    state.client = { from: vi.fn(() => builder) };

    await createPatient('clinic-1', 'user-1', patientInput);

    expect(builder.insert).toHaveBeenCalledWith({
      clinic_id: 'clinic-1', created_by: 'user-1', full_name: 'Ana Silva',
      preferred_name: null, document_number: null, phone: '11999999999',
      email: 'ana@example.com', gender: null, birth_date: null,
      tags: ['retorno'], clinical_notes: null,
    });
  });

  it('preserves optional values and inactive status returned by the database', async () => {
    const completeRow = {
      ...patientRow,
      preferred_name: 'Aninha', document_number: '123', phone: '1199',
      email: 'ana@example.com', gender: 'Feminino', birth_date: '1990-01-02',
      clinical_notes: 'Atenção', status: 'inactive',
    };
    const builder = query({ data: completeRow, error: null });
    state.client = { from: vi.fn(() => builder) };

    const created = await createPatient('clinic-1', 'user-1', {
      ...patientInput, nickname: 'Aninha', cpf: '123', gender: 'Feminino',
      birthDate: '1990-01-02', notes: 'Atenção',
    });

    expect(created).toEqual(expect.objectContaining({
      nickname: 'Aninha', cpf: '123', gender: 'Feminino',
      birthDate: '1990-01-02', notes: 'Atenção', status: 'Inativo',
    }));
    expect(builder.insert).toHaveBeenCalledWith(expect.objectContaining({
      preferred_name: 'Aninha', document_number: '123', gender: 'Feminino',
      birth_date: '1990-01-02', clinical_notes: 'Atenção',
    }));
  });

  it('updates only provided patient fields and always scopes by clinic', async () => {
    const builder = query({ data: { ...patientRow, status: 'inactive' }, error: null });
    state.client = { from: vi.fn(() => builder) };

    const updated = await updatePatientRecord('clinic-1', {
      id: 'p1', nickname: ' Aninha ', status: 'Inativo', notes: '',
    });

    expect(builder.update).toHaveBeenCalledWith({
      preferred_name: 'Aninha', status: 'inactive', clinical_notes: null,
    });
    expect(builder.eq).toHaveBeenNthCalledWith(1, 'id', 'p1');
    expect(builder.eq).toHaveBeenNthCalledWith(2, 'clinic_id', 'clinic-1');
    expect(updated.status).toBe('Inativo');
  });

  it('maps every editable field in a complete patient update', async () => {
    const builder = query({ data: patientRow, error: null });
    state.client = { from: vi.fn(() => builder) };

    await updatePatientRecord('clinic-1', {
      id: 'p1', name: ' Ana ', nickname: '', cpf: '', phone: '', email: '',
      gender: '', birthDate: '', tags: ['novo'], notes: ' Nota ', status: 'Ativo',
    });

    expect(builder.update).toHaveBeenCalledWith({
      full_name: 'Ana', preferred_name: null, document_number: null, phone: null,
      email: null, gender: null, birth_date: null, tags: ['novo'],
      clinical_notes: 'Nota', status: 'active',
    });
  });

  it('soft-deletes patients rather than issuing a hard delete', async () => {
    const builder = query({ error: null });
    state.client = { from: vi.fn(() => builder) };

    await deletePatientRecord('clinic-1', 'p1');

    expect(builder.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'archived' }));
    expect(builder.eq).toHaveBeenCalledWith('clinic_id', 'clinic-1');
    expect(builder.is).toHaveBeenCalledWith('deleted_at', null);
  });

  it('maps appointments, modes, statuses and removed patients', async () => {
    const builder = query({ data: [{
      id: 'a1', patient_id: 'missing', starts_at: '2026-08-13T15:30:00.000Z',
      mode: 'online', status: 'no_show',
    }], error: null });
    state.client = { from: vi.fn(() => builder) };

    const [appointment] = await listAppointments('clinic-1', []);

    expect(appointment).toEqual(expect.objectContaining({
      id: 'a1', patientName: 'Paciente removido', type: 'Online', status: 'Não compareceu',
    }));
    expect(builder.order).toHaveBeenCalledWith('starts_at', { ascending: true });
  });

  it('keeps unknown appointment statuses and resolves known patients', async () => {
    const builder = query({ data: [{
      id: 'a2', patient_id: 'p1', starts_at: '2026-08-13T15:30:00.000Z',
      mode: 'in_person', status: 'waiting_room',
    }], error: null });
    state.client = { from: vi.fn(() => builder) };

    const [appointment] = await listAppointments('clinic-1', [{
      ...patientInput, id: 'p1', name: 'Ana Silva', lastModified: '', status: 'Ativo',
    }]);

    expect(appointment).toEqual(expect.objectContaining({
      patientName: 'Ana Silva', type: 'Presencial', status: 'waiting_room',
    }));
  });

  it('returns an empty appointment list when the query has no rows', async () => {
    const builder = query({ data: null, error: null });
    state.client = { from: vi.fn(() => builder) };
    await expect(listAppointments('clinic-1', [])).resolves.toEqual([]);
  });

  it('creates appointments with ownership and canonical database values', async () => {
    const builder = query({ data: {
      id: 'a1', patient_id: 'p1', starts_at: '2026-08-13T15:30:00.000Z',
      mode: 'in_person', status: 'confirmed',
    }, error: null });
    state.client = { from: vi.fn(() => builder) };

    const appointment = await createAppointment('clinic-1', 'user-1', {
      patientId: 'p1', date: '2026-08-13', time: '12:30', type: 'Presencial',
    }, 'Ana Silva');

    expect(builder.insert).toHaveBeenCalledWith(expect.objectContaining({
      clinic_id: 'clinic-1', created_by: 'user-1', professional_id: 'user-1',
      patient_id: 'p1', mode: 'in_person', status: 'confirmed',
    }));
    expect(appointment.patientName).toBe('Ana Silva');
    expect(appointment.status).toBe('Confirmada');
  });

  it('cancels only the appointment belonging to the active clinic', async () => {
    const builder = query({ error: null });
    state.client = { from: vi.fn(() => builder) };

    await cancelAppointmentRecord('clinic-1', 'a1');

    expect(builder.update).toHaveBeenCalledWith({ status: 'cancelled' });
    expect(builder.eq).toHaveBeenNthCalledWith(1, 'id', 'a1');
    expect(builder.eq).toHaveBeenNthCalledWith(2, 'clinic_id', 'clinic-1');
  });

  it('propagates Supabase errors to the caller', async () => {
    const failure = new Error('database unavailable');
    const builder = query({ data: null, error: failure });
    state.client = { from: vi.fn(() => builder) };

    await expect(listPatients('clinic-1')).rejects.toBe(failure);
  });

  it.each([
    ['create patient', () => createPatient('clinic-1', 'user-1', patientInput)],
    ['update patient', () => updatePatientRecord('clinic-1', { id: 'p1', name: 'Ana' })],
    ['delete patient', () => deletePatientRecord('clinic-1', 'p1')],
    ['list appointments', () => listAppointments('clinic-1', [])],
    ['create appointment', () => createAppointment('clinic-1', 'user-1', {
      patientId: 'p1', date: '2026-08-13', time: '12:30', type: 'Online',
    }, 'Ana')],
    ['cancel appointment', () => cancelAppointmentRecord('clinic-1', 'a1')],
  ])('propagates errors from %s', async (_operation, execute) => {
    const failure = new Error('database unavailable');
    const builder = query({ data: null, error: failure });
    state.client = { from: vi.fn(() => builder) };
    await expect(execute()).rejects.toBe(failure);
  });
});
