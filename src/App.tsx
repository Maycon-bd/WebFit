import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './modules/layout/Navbar';
import Dashboard from './modules/dashboard/Dashboard';
import PatientManager from './modules/pacientes/PatientManager';
import Scheduler from './modules/agendamentos/Scheduler';
import FoodDiary from './modules/diario/FoodDiary';
import Financials from './modules/financeiro/Financials';
import StudiesPanel from './modules/estudos/StudiesPanel';
import MarketingPanel from './modules/marketing/MarketingPanel';
import ToolsPanel from './modules/ferramentas/ToolsPanel';
import ChatWindow from './modules/chat/ChatWindow';
import SupportPanel from './modules/suporte/SupportPanel';
import Modal from './modules/shared/Modal';
import type { AppTheme } from './types';
import StorageStatus from './components/StorageStatus';
import AuthGate from './components/AuthGate';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import ToastHost from './components/Toast';

import './styles/global.css';

const InnerApp: React.FC = () => {
  const {
    activePage,
    setActivePage,
    userProfile,
    setUserProfile,
    setSelectedPatientId,
    appTheme,
    setAppTheme,
  } = useContext(AppContext);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Profile edit form fields
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileCRN, setProfileCRN] = useState(userProfile.crn);
  const [profileWhatsApp, setProfileWhatsApp] = useState(userProfile.whatsapp);

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name: profileName,
      crn: profileCRN,
      whatsapp: profileWhatsApp,
    }));
    setIsProfileOpen(false);
    alert('Perfil profissional atualizado com sucesso!');
  };

  const handleOpenProfileModal = () => {
    setProfileName(userProfile.name);
    setProfileCRN(userProfile.crn);
    setProfileWhatsApp(userProfile.whatsapp);
    setIsProfileOpen(true);
  };

  const handleAddPatientFromDashboard = () => {
    setSelectedPatientId(null);
    setActivePage('pacientes');
  };

  const themeButtonStyle = (theme: AppTheme): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: appTheme === theme
      ? '2px solid var(--primary-teal)'
      : '1px solid var(--input-border)',
    cursor: 'pointer',
    textAlign: 'left',
  });

  return (
    <div className={`app-container theme-${appTheme}`}>
      <StorageStatus />
      <ToastHost />
      <Navbar onOpenProfile={handleOpenProfileModal} />

      <main>
        {activePage === 'dashboard' && (
          <Dashboard onAddPatientClick={handleAddPatientFromDashboard} />
        )}
        {activePage === 'pacientes' && <PatientManager />}
        {activePage === 'agendamentos' && <Scheduler />}
        {activePage === 'diario' && <FoodDiary />}
        {activePage === 'financeiro' && <Financials />}
        {activePage === 'estudos' && <StudiesPanel />}
        {activePage === 'marketing' && <MarketingPanel />}
        {activePage === 'ferramentas' && <ToolsPanel />}
        {activePage === 'chat' && <ChatWindow />}
        {activePage === 'suporte' && <SupportPanel />}
      </main>

      {/* Profile Modal */}
      <Modal
        title="Perfil do Profissional"
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      >
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>Nome Completo</label>
            <input
              type="text"
              className="form-control"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Registro Profissional (CRN)</label>
            <input
              type="text"
              className="form-control"
              value={profileCRN}
              onChange={(e) => setProfileCRN(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Celular para Integração WhatsApp</label>
            <input
              type="text"
              className="form-control"
              value={profileWhatsApp}
              onChange={(e) => setProfileWhatsApp(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Tema Visual da Plataforma</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setAppTheme('midnight')}
                style={{ ...themeButtonStyle('midnight'), backgroundColor: '#0b1020', color: '#f8faff' }}
              >
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#818cf8', border: '1px solid #c4cbe0' }}></span>
                Meia-Noite
              </button>
              <button
                type="button"
                onClick={() => setAppTheme('oled')}
                style={{ ...themeButtonStyle('oled'), backgroundColor: '#000000', color: '#f3fdf8' }}
              >
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '1px solid #5eead4' }}></span>
                OLED
              </button>
              <button
                type="button"
                onClick={() => setAppTheme('slate')}
                style={{ ...themeButtonStyle('slate'), backgroundColor: '#dce4ec', color: '#1f2d3d' }}
              >
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0f766e', border: '1px solid #1f2d3d' }}></span>
                Cinza Slate
              </button>
              <button
                type="button"
                onClick={() => setAppTheme('light')}
                style={{
                  ...themeButtonStyle('light'),
                  backgroundColor: '#f4f7fb',
                  color: '#14213d',
                }}
              >
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2563eb', border: '1px solid #14213d' }}></span>
                Claro Suave
              </button>
            </div>
          </div>

          <div style={{ padding: '12px', backgroundColor: 'var(--primary-teal-light)', borderRadius: '6px', border: '1px solid var(--primary-teal-border)', fontSize: '13px' }}>
            <strong>Plano atual:</strong> {userProfile.isBlack ? 'WebFit Pro' : 'WebFit Essencial'}
            <div style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '4px' }}>
              Recursos avançados podem ser gerenciados na área de assinatura.
            </div>
          </div>
          <button type="submit" className="btn-teal" style={{ marginTop: '10px' }}>
            Salvar Alterações
          </button>
        </form>
      </Modal>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <AuthGate>
          <AppProvider>
            <InnerApp />
          </AppProvider>
        </AuthGate>
      </WorkspaceProvider>
    </AuthProvider>
  );
};

export default App;
