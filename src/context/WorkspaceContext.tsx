import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { createClinicWorkspace, listClinicWorkspaces, type ClinicWorkspace } from '../services/clinicRepository';

interface WorkspaceContextValue {
  activeClinic: ClinicWorkspace | null;
  loading: boolean;
  error: string | null;
  createClinic: (name: string) => Promise<string | null>;
  refresh: () => Promise<void>;
}

const demoClinic: ClinicWorkspace = {
  id: 'demo-clinic',
  name: 'Clínica de Demonstração',
  slug: 'clinica-demonstracao',
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export const WorkspaceProvider = ({ children }: React.PropsWithChildren) => {
  const { configured, user } = useAuth();
  const [activeClinic, setActiveClinic] = useState<ClinicWorkspace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!configured) {
      setActiveClinic(demoClinic);
      setError(null);
      setLoading(false);
      return;
    }
    if (!user) {
      setActiveClinic(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const clinics = await listClinicWorkspaces();
      setActiveClinic(clinics[0] ?? null);
    } catch (cause) {
      console.error('[WebFit workspace] Falha ao carregar clínica', cause);
      setError('Não foi possível carregar a clínica. Verifique se a migration foi aplicada.');
    } finally {
      setLoading(false);
    }
  }, [configured, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<WorkspaceContextValue>(() => ({
    activeClinic,
    loading,
    error,
    refresh,
    createClinic: async (name) => {
      if (!configured) {
        setActiveClinic({ ...demoClinic, name: name.trim() || demoClinic.name });
        return null;
      }
      if (!user) return 'Entre novamente para criar sua clínica.';
      try {
        const clinic = await createClinicWorkspace(name.trim(), user.id);
        setActiveClinic(clinic);
        setError(null);
        return null;
      } catch (cause) {
        console.error('[WebFit workspace] Falha ao criar clínica', cause);
        return cause instanceof Error ? cause.message : 'Não foi possível criar a clínica.';
      }
    },
  }), [activeClinic, configured, error, loading, refresh, user]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = () => {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error('useWorkspace precisa estar dentro de WorkspaceProvider');
  return value;
};
