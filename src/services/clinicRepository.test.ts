import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ client: null as unknown }));

vi.mock('../lib/supabase', () => ({
  get supabase() {
    return state.client;
  },
}));

import { createClinicWorkspace, listClinicWorkspaces } from './clinicRepository';

type Result = { data?: unknown; error?: unknown };

const query = (result: Result) => {
  const builder = {
    select: vi.fn(),
    is: vi.fn(),
    order: vi.fn(),
    insert: vi.fn(),
    then: (resolve: (value: Result) => unknown) => Promise.resolve(result).then(resolve),
  };
  builder.select.mockReturnValue(builder);
  builder.is.mockReturnValue(builder);
  builder.order.mockReturnValue(builder);
  builder.insert.mockReturnValue(builder);
  return builder;
};

describe('clinic repository', () => {
  beforeEach(() => {
    state.client = null;
    vi.restoreAllMocks();
  });

  it('fails clearly when Supabase is not configured', async () => {
    await expect(listClinicWorkspaces()).rejects.toThrow('Supabase não configurado.');
  });

  it('lists only active clinics in creation order', async () => {
    const rows = [{ id: 'c1', name: 'Clínica Um', slug: 'clinica-um' }];
    const builder = query({ data: rows, error: null });
    const from = vi.fn(() => builder);
    state.client = { from };

    await expect(listClinicWorkspaces()).resolves.toEqual(rows);
    expect(from).toHaveBeenCalledWith('clinics');
    expect(builder.select).toHaveBeenCalledWith('id, name, slug');
    expect(builder.is).toHaveBeenCalledWith('deleted_at', null);
    expect(builder.order).toHaveBeenCalledWith('created_at', { ascending: true });
  });

  it('returns an empty list for a successful query without rows', async () => {
    const builder = query({ data: null, error: null });
    state.client = { from: vi.fn(() => builder) };
    await expect(listClinicWorkspaces()).resolves.toEqual([]);
  });

  it('propagates listing failures', async () => {
    const failure = new Error('network failure');
    const builder = query({ data: null, error: failure });
    state.client = { from: vi.fn(() => builder) };
    await expect(listClinicWorkspaces()).rejects.toBe(failure);
  });

  it('creates a normalized, unique clinic slug and ownership payload', async () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('12345678-1234-4123-8123-123456789abc');
    const builder = query({ error: null });
    state.client = { from: vi.fn(() => builder) };

    await expect(createClinicWorkspace('Clínica São José', 'user-1')).resolves.toEqual({
      id: '12345678-1234-4123-8123-123456789abc',
      name: 'Clínica São José',
      slug: 'clinica-sao-jose-123456',
    });
    expect(builder.insert).toHaveBeenCalledWith({
      id: '12345678-1234-4123-8123-123456789abc',
      owner_id: 'user-1',
      created_by: 'user-1',
      name: 'Clínica São José',
      slug: 'clinica-sao-jose-123456',
    });
  });

  it('uses a safe slug fallback and propagates database failures', async () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('abcdef12-1234-4123-8123-123456789abc');
    const failure = new Error('duplicate key');
    const builder = query({ error: failure });
    state.client = { from: vi.fn(() => builder) };

    await expect(createClinicWorkspace('!!!', 'user-1')).rejects.toBe(failure);
    expect(builder.insert).toHaveBeenCalledWith(expect.objectContaining({ slug: 'clinica-abcdef' }));
  });
});
