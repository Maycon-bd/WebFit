import { supabase } from '../lib/supabase';

export interface ClinicWorkspace {
  id: string;
  name: string;
  slug: string;
}

const requireClient = () => {
  if (!supabase) throw new Error('Supabase não configurado.');
  return supabase;
};

export const listClinicWorkspaces = async (): Promise<ClinicWorkspace[]> => {
  const client = requireClient();
  const { data, error } = await client
    .from('clinics')
    .select('id, name, slug')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const createClinicWorkspace = async (name: string, ownerId: string): Promise<ClinicWorkspace> => {
  const client = requireClient();
  const id = crypto.randomUUID();
  const slugBase = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'clinica';
  const slug = `${slugBase}-${id.slice(0, 6)}`;

  const { error } = await client.from('clinics').insert({ id, owner_id: ownerId, name, slug });
  if (error) throw error;
  return { id, name, slug };
};
