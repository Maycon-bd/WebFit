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
  const { activePage, setActivePage, userProfile, setUserProfile, setSelectedPatientId } = useContext(AppContext);
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
    <div className="app-container">
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
          <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
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
