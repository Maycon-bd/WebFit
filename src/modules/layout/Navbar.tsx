import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import DropdownMenu from './DropdownMenu';
import NotificationPanel from './NotificationPanel';
import type { AppPage } from '../../types';
import './styles.css';

interface NavbarProps {
  onOpenProfile: () => void;
}

type QuickAction = 'task' | 'patient' | 'appointment' | 'finance' | 'questionnaire' | 'cloud';
type DropdownName = 'consultorio' | 'estudos';

const Navbar: React.FC<NavbarProps> = ({ onOpenProfile }) => {
  const {
    setActivePage,
    notifications,
    userProfile,
    setSelectedPatientId,
    setTriggerPatientCreate,
    setTriggerAppointmentCreate,
    setTriggerFinancialsCreate,
    addPlannerTask,
  } = useContext(AppContext);

  const [openDropdown, setOpenDropdown] = useState<DropdownName | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);

  const handleQuickAction = (action: QuickAction) => {
    setIsGridOpen(false);
    if (action === 'task') {
      const text = prompt('Escreva a descrição da nova tarefa:');
      if (text && text.trim() !== '') {
        const todayStr = new Date().toISOString().split('T')[0];
        addPlannerTask(text.trim(), todayStr);
        alert('Tarefa adicionada com sucesso no seu Planner para hoje!');
      }
    } else if (action === 'patient') {
      setSelectedPatientId(null);
      setTriggerPatientCreate(true);
      setActivePage('pacientes');
    } else if (action === 'appointment') {
      setTriggerAppointmentCreate(true);
      setActivePage('agendamentos');
    } else if (action === 'finance') {
      setTriggerFinancialsCreate(true);
      setActivePage('financeiro');
    }
  };

  const toggleDropdown = (name: DropdownName) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
      setIsNotificationsOpen(false);
    }
  };

  const handlePageSelect = (page: AppPage, patientId: string | null = null) => {
    setActivePage(page);
    if (patientId) {
      setSelectedPatientId(patientId);
    } else if (page === 'pacientes') {
      setSelectedPatientId(null);
    }
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  // Dropdown Configurations
  const consultorioOptions = [
    { label: 'Pacientes', onClick: () => handlePageSelect('pacientes') },
    { label: 'Agendamentos', onClick: () => handlePageSelect('agendamentos') },
    { label: 'Pré-consulta', onClick: () => handlePageSelect('pacientes') },
    { label: 'Meus favoritos', onClick: () => handlePageSelect('pacientes') },
    { label: 'Receitas culinárias', onClick: () => handlePageSelect('pacientes') },
    { label: 'Diário alimentar', onClick: () => handlePageSelect('diario') },
    { label: 'Financeiro', onClick: () => handlePageSelect('financeiro') },
    { label: 'Impressos', onClick: () => handlePageSelect('pacientes') },
    { label: 'Lixeira', onClick: () => handlePageSelect('pacientes') },
  ];

  const estudosOptions = [
    { label: 'Lâminas', onClick: () => handlePageSelect('estudos') },
  ];

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <header className="navbar">
      <div className="nav-left">
        <div className="nav-logo" onClick={() => handlePageSelect('dashboard')}>
          <div className="logo-icon">
            <div className="logo-circle"></div>
            <div className="logo-center"></div>
          </div>
          <span>WebFit</span>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {/* Consultorio Dropdown */}
          <div className="nav-item-container">
            <button
              className={`nav-btn ${openDropdown === 'consultorio' ? 'open' : ''}`}
              onClick={() => toggleDropdown('consultorio')}
            >
              Consultório <span className="chevron"></span>
            </button>
            <DropdownMenu
              options={consultorioOptions}
              isOpen={openDropdown === 'consultorio'}
              onClose={() => setOpenDropdown(null)}
            />
          </div>

          {/* Estudos Dropdown */}
          <div className="nav-item-container">
            <button
              className={`nav-btn ${openDropdown === 'estudos' ? 'open' : ''}`}
              onClick={() => toggleDropdown('estudos')}
            >
              Estudos <span className="chevron"></span>
            </button>
            <DropdownMenu
              options={estudosOptions}
              isOpen={openDropdown === 'estudos'}
              onClose={() => setOpenDropdown(null)}
            />
          </div>
        </nav>
      </div>

      <div className="nav-right">
        {/* WhatsApp Icon */}
        <button
          className="icon-btn whatsapp-circle"
          onClick={() => {
            const num = userProfile.whatsapp || '5511999999999';
            window.open(`https://wa.me/${num}`, '_blank');
          }}
          title="Falar no WhatsApp"
        >
          <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.004 2c-5.518 0-9.996 4.477-9.996 9.995 0 1.765.459 3.487 1.33 5.004L2 22l5.127-1.345c1.47.8 3.119 1.22 4.873 1.22 5.518 0 9.997-4.477 9.997-9.995 0-5.518-4.479-9.995-9.997-9.995zm4.846 13.992c-.22.613-1.077 1.144-1.639 1.19-.505.042-1.162.062-1.872-.164-.452-.143-1.012-.348-1.724-.655-3.033-1.31-5.002-4.385-5.155-4.588-.153-.203-1.246-1.657-1.246-3.16 0-1.502.788-2.24 1.072-2.54.283-.3.619-.374.825-.374.207 0 .414.002.595.01.187.009.439-.073.687.525.253.61.865 2.106.94 2.259.075.152.125.33.025.53-.1.2-.15.33-.3.504-.15.176-.316.39-.452.523-.153.15-.314.313-.135.62.18.307.8 1.303 1.714 2.117.915.814 1.688 1.066 1.993 1.22.306.152.484.127.665-.078.18-.203.784-.913.996-1.224.212-.31.424-.26.714-.152.29.11 1.842.87 2.158 1.028.318.158.528.236.604.368.077.132.077.766-.143 1.38z" />
          </svg>
        </button>

        {/* Notification Bell */}
        <div className="notification-bell-container">
          <button
            className="icon-btn"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setOpenDropdown(null);
            }}
            title="Notificações do Diário"
          >
            <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadNotificationsCount > 0 && <span className="bell-badge"></span>}
          </button>
          <NotificationPanel
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* Apps Grid button */}
        <div className="apps-grid-container">
          <button
            className="icon-btn"
            onClick={() => {
              setIsGridOpen(!isGridOpen);
              setIsNotificationsOpen(false);
              setOpenDropdown(null);
            }}
            title="Atalhos Rápidos de Ações"
          >
            <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
            </svg>
          </button>

          {isGridOpen && (
            <div className="apps-grid-dropdown">
              <div className="grid-item" onClick={() => handleQuickAction('task')}>
                <div className="grid-icon-circle">
                  <svg style={{ width: '22px', height: '22px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
                <span className="grid-item-label">nova tarefa</span>
              </div>

              <div className="grid-item" onClick={() => handleQuickAction('patient')}>
                <div className="grid-icon-circle">
                  <svg style={{ width: '22px', height: '22px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <span className="grid-item-label">novo paciente</span>
              </div>

              <div className="grid-item" onClick={() => handleQuickAction('appointment')}>
                <div className="grid-icon-circle">
                  <svg style={{ width: '22px', height: '22px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
                  </svg>
                </div>
                <span className="grid-item-label">novo agendamento</span>
              </div>

              <div className="grid-item" onClick={() => handleQuickAction('finance')}>
                <div className="grid-icon-circle">
                  <svg style={{ width: '22px', height: '22px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2-.9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                </div>
                <span className="grid-item-label">novo registro financeiro</span>
              </div>

              <div className="grid-item" onClick={() => handleQuickAction('questionnaire')}>
                <div className="grid-icon-circle">
                  <svg style={{ width: '22px', height: '22px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span className="grid-item-label">novo questionário</span>
              </div>

              <div className="grid-item" onClick={() => handleQuickAction('cloud')}>
                <div className="grid-icon-circle">
                  <svg style={{ width: '22px', height: '22px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                  </svg>
                </div>
                <span className="grid-item-label">novo arquivo no cloud</span>
              </div>
            </div>
          )}
        </div>

        {/* User profile avatar */}
        <button
          className="user-avatar-btn"
          onClick={onOpenProfile}
          title="Ver Perfil Profissional"
        >
          <img src={userProfile.avatar} alt="Avatar do Nutricionista" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
