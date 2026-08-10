import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthScreen from './AuthScreen';
import ClinicSetupScreen from './ClinicSetupScreen';
import { useWorkspace } from '../context/WorkspaceContext';

const AuthGate = ({ children }: React.PropsWithChildren) => {
  const { configured, loading, session } = useAuth();
  const workspace = useWorkspace();

  if (!configured) return children;
  if (loading) return <div className="app-loading" role="status"><span className="brand-mark">W</span><p>Preparando seu espaço…</p></div>;
  if (!session) return <AuthScreen />;
  if (workspace.loading) return <div className="app-loading" role="status"><span className="brand-mark">W</span><p>Carregando sua clínica…</p></div>;
  if (!workspace.activeClinic) return <ClinicSetupScreen />;
  return children;
};

export default AuthGate;
