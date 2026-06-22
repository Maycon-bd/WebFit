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

import './styles/global.css';

const InnerApp = () => {
  const { activePage, setActivePage, userProfile, setUserProfile, setSelectedPatientId, appTheme, setAppTheme } = useContext(AppContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  
  // Profile edit form fields
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileCRN, setProfileCRN] = useState(userProfile.crn);
  const [profileWhatsApp, setProfileWhatsApp] = useState(userProfile.whatsapp);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name: profileName,
      crn: profileCRN,
      whatsapp: profileWhatsApp
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

  // Helper trigger to open patient registration directly
  const handleAddPatientFromDashboard = () => {
    setSelectedPatientId(null);
    setActivePage('pacientes');
    // We delay the render of PatientManager slightly or rely on state trigger, 
    // but in PatientManager, since selectedPatientId is null and mode is list, 
    // we want to ensure it opens in creation. Let's make it go to patients tab.
  };

  return (
    <div className={`app-container theme-${appTheme}`}>
      {/* Navbar receives profile trigger */}
      <Navbar onOpenProfile={handleOpenProfileModal} />


      {/* Main Pages Switchboard */}
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
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  border: appTheme === 'midnight' ? '2px solid var(--primary-teal)' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: 'var(--bg-dark)', 
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0b131e', border: '1px solid #ffffff' }}></span>
                Meia-Noite
              </button>
              <button 
                type="button" 
                onClick={() => setAppTheme('oled')} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  border: appTheme === 'oled' ? '2px solid var(--primary-teal)' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: '#000000', 
                  color: '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#000000', border: '1px solid #ffffff' }}></span>
                OLED Black
              </button>
              <button 
                type="button" 
                onClick={() => setAppTheme('slate')} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  border: appTheme === 'slate' ? '2px solid var(--primary-teal)' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: '#0f172a', 
                  color: '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0f172a', border: '1px solid #ffffff' }}></span>
                Cinza Slate
              </button>
              <button 
                type="button" 
                onClick={() => setAppTheme('light')} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  border: appTheme === 'light' ? '2px solid var(--primary-teal)' : '1px solid rgba(0,0,0,0.15)',
                  backgroundColor: '#ffffff', 
                  color: '#0f172a',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f8fafc', border: '1px solid #0f172a' }}></span>
                Claro Suave
              </button>
            </div>
          </div>

          <div style={{ padding: '12px', backgroundColor: 'var(--primary-teal-light)', borderRadius: '6px', border: '1px solid var(--primary-teal-border)', fontSize: '13px' }}>
            <strong>Plano Atual:</strong> {userProfile.isBlack ? '👑 WebDiet Black' : 'WebDiet Padrão'}
            <div style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '4px' }}>
              Para assinar ou gerenciar o plano Black, utilize o banner principal dourado do Dashboard.
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

const App = () => {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
};

export default App;
