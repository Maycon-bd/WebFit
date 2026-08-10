import { supabase } from '../lib/supabase';
import type { Appointment, Patient } from '../types';
import type { TablesInsert, TablesUpdate } from '../types/database';

const requireClient = () => {
  if (!supabase) throw new Error('Supabase não configurado.');
  return supabase;
};

const formatTimestamp = (value: string) => new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'medium',
}).format(new Date(value)).replace(',', ' -');

const patientFromRow = (row: {
  id: string;
  full_name: string;
  preferred_name: string | null;
  document_number: string | null;
  phone: string | null;
  email: string | null;
  gender: string | null;
  birth_date: string | null;
  tags: string[];
  updated_at: string;
  clinical_notes: string | null;
  status: string;
}): Patient => ({
  id: row.id,
  name: row.full_name,
  nickname: row.preferred_name ?? '',
  cpf: row.document_number ?? '',
  phone: row.phone ?? '',
  email: row.email ?? '',
  gender: row.gender ?? '',
  birthDate: row.birth_date ?? '',
  tags: row.tags ?? [],
  lastModified: formatTimestamp(row.updated_at),
  notes: row.clinical_notes ?? '',
  status: row.status === 'inactive' ? 'Inativo' : 'Ativo',
});

const appointmentStatus: Record<string, string> = {
  scheduled: 'Agendada',
  confirmed: 'Confirmada',
  completed: 'Realizada',
  cancelled: 'Cancelada',
  no_show: 'Não compareceu',
};

const appointmentFromRow = (
  row: {
    id: string;
    patient_id: string;
    starts_at: string;
    mode: 'in_person' | 'online';
    status: string;
  },
  patientNames: Map<string, string>,
): Appointment => {
  const startsAt = new Date(row.starts_at);
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: patientNames.get(row.patient_id) ?? 'Paciente removido',
    date: [startsAt.getFullYear(), String(startsAt.getMonth() + 1).padStart(2, '0'), String(startsAt.getDate()).padStart(2, '0')].join('-'),
    time: `${String(startsAt.getHours()).padStart(2, '0')}:${String(startsAt.getMinutes()).padStart(2, '0')}`,
    type: row.mode === 'online' ? 'Online' : 'Presencial',
    status: appointmentStatus[row.status] ?? row.status,
  };
};

export const listPatients = async (clinicId: string): Promise<Patient[]> => {
  const { data, error } = await requireClient()
    .from('patients')
    .select('*')
    .eq('clinic_id', clinicId)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(patientFromRow);
};

export const createPatient = async (
  clinicId: string,
  userId: string,
  patient: Omit<Patient, 'id' | 'lastModified' | 'status'>,
): Promise<Patient> => {
  const payload: TablesInsert<'patients'> = {
    clinic_id: clinicId,
    created_by: userId,
    full_name: patient.name.trim(),
    preferred_name: patient.nickname.trim() || null,
    document_number: patient.cpf.trim() || null,
    phone: patient.phone.trim() || null,
    email: patient.email.trim() || null,
    gender: patient.gender || null,
    birth_date: patient.birthDate || null,
    tags: patient.tags,
    clinical_notes: patient.notes.trim() || null,
  };
  const { data, error } = await requireClient().from('patients').insert(payload).select().single();
  if (error) throw error;
  return patientFromRow(data);
};

export const updatePatientRecord = async (
  clinicId: string,
  patient: Partial<Patient> & { id: string },
): Promise<Patient> => {
  const payload: TablesUpdate<'patients'> = {};
  if (patient.name !== undefined) payload.full_name = patient.name.trim();
  if (patient.nickname !== undefined) payload.preferred_name = patient.nickname.trim() || null;
  if (patient.cpf !== undefined) payload.document_number = patient.cpf.trim() || null;
  if (patient.phone !== undefined) payload.phone = patient.phone.trim() || null;
  if (patient.email !== undefined) payload.email = patient.email.trim() || null;
  if (patient.gender !== undefined) payload.gender = patient.gender || null;
  if (patient.birthDate !== undefined) payload.birth_date = patient.birthDate || null;
  if (patient.tags !== undefined) payload.tags = patient.tags;
  if (patient.notes !== undefined) payload.clinical_notes = patient.notes.trim() || null;
  if (patient.status !== undefined) payload.status = patient.status === 'Inativo' ? 'inactive' : 'active';

  const { data, error } = await requireClient()
    .from('patients')
    .update(payload)
    .eq('id', patient.id)
    .eq('clinic_id', clinicId)
    .select()
    .single();
  if (error) throw error;
  return patientFromRow(data);
};

export const deletePatientRecord = async (clinicId: string, patientId: string): Promise<void> => {
  const { error } = await requireClient()
    .from('patients')
    .update({ deleted_at: new Date().toISOString(), status: 'archived' })
    .eq('id', patientId)
    .eq('clinic_id', clinicId)
    .is('deleted_at', null);
  if (error) throw error;
};

export const listAppointments = async (clinicId: string, patients: Patient[]): Promise<Appointment[]> => {
  const { data, error } = await requireClient()
    .from('appointments')
    .select('id, patient_id, starts_at, mode, status')
    .eq('clinic_id', clinicId)
    .is('deleted_at', null)
    .order('starts_at', { ascending: true });
  if (error) throw error;
  const patientNames = new Map(patients.map((patient) => [patient.id, patient.name]));
  return (data ?? []).map((row) => appointmentFromRow(row, patientNames));
};

export const createAppointment = async (
  clinicId: string,
  professionalId: string,
  appointment: Omit<Appointment, 'id' | 'patientName' | 'status'>,
  patientName: string,
): Promise<Appointment> => {
  const payload: TablesInsert<'appointments'> = {
    clinic_id: clinicId,
    created_by: professionalId,
    patient_id: appointment.patientId,
    professional_id: professionalId,
    starts_at: new Date(`${appointment.date}T${appointment.time}:00`).toISOString(),
    mode: appointment.type === 'Online' ? 'online' : 'in_person',
    status: 'confirmed',
  };
  const { data, error } = await requireClient()
    .from('appointments')
    .insert(payload)
    .select('id, patient_id, starts_at, mode, status')
    .single();
  if (error) throw error;
  return appointmentFromRow(data, new Map([[appointment.patientId, patientName]]));
};

export const cancelAppointmentRecord = async (clinicId: string, appointmentId: string): Promise<void> => {
  const { error } = await requireClient()
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', appointmentId)
    .eq('clinic_id', clinicId);
  if (error) throw error;
};
