import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  auth: { configured: false, user: null as { id: string } | null },
  list: vi.fn(),
  create: vi.fn(),
}));

vi.mock('./AuthContext', () => ({ useAuth: () => state.auth }));
vi.mock('../services/clinicRepository', () => ({
  listClinicWorkspaces: state.list,
  createClinicWorkspace: state.create,
}));

import { useWorkspace, WorkspaceProvider } from './WorkspaceContext';

const Harness = () => {
  const workspace = useWorkspace();
  return (
    <>
      <output data-testid="clinic">{workspace.activeClinic?.name ?? 'none'}</output>
      <output data-testid="loading">{String(workspace.loading)}</output>
      <output data-testid="error">{workspace.error ?? ''}</output>
      <button onClick={() => void workspace.createClinic('  Nova Clínica  ')}>create</button>
      <button onClick={() => void workspace.refresh()}>refresh</button>
    </>
  );
};

const renderWorkspace = () => render(<WorkspaceProvider><Harness /></WorkspaceProvider>);

describe('WorkspaceContext', () => {
  beforeEach(() => {
    state.auth = { configured: false, user: null };
    state.list.mockReset();
    state.create.mockReset();
  });

  it('provides an isolated demo clinic and allows renaming it locally', async () => {
    renderWorkspace();
    expect(await screen.findByText('Clínica de Demonstração')).toBeInTheDocument();

    await act(async () => screen.getByRole('button', { name: 'create' }).click());

    expect(screen.getByTestId('clinic')).toHaveTextContent('Nova Clínica');
    expect(state.create).not.toHaveBeenCalled();
  });

  it('does not query clinics without an authenticated user', async () => {
    state.auth = { configured: true, user: null };
    renderWorkspace();

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('clinic')).toHaveTextContent('none');
    expect(state.list).not.toHaveBeenCalled();
  });

  it('loads the first authorized clinic and creates a trimmed clinic', async () => {
    state.auth = { configured: true, user: { id: 'user-1' } };
    state.list.mockResolvedValue([{ id: 'c1', name: 'Clínica Atual', slug: 'atual' }]);
    state.create.mockResolvedValue({ id: 'c2', name: 'Nova Clínica', slug: 'nova' });
    renderWorkspace();

    expect(await screen.findByText('Clínica Atual')).toBeInTheDocument();
    await act(async () => screen.getByRole('button', { name: 'create' }).click());

    expect(state.create).toHaveBeenCalledWith('Nova Clínica', 'user-1');
    expect(screen.getByTestId('clinic')).toHaveTextContent('Nova Clínica');
    expect(screen.getByTestId('error')).toBeEmptyDOMElement();
  });

  it('exposes a stable message when loading the workspace fails', async () => {
    state.auth = { configured: true, user: { id: 'user-1' } };
    state.list.mockRejectedValue(new Error('offline'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    renderWorkspace();

    await waitFor(() => expect(screen.getByTestId('error')).not.toBeEmptyDOMElement());
    expect(screen.getByTestId('error')).toHaveTextContent('Não foi possível carregar a clínica');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });
});
