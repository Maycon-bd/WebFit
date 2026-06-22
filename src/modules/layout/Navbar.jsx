import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import DropdownMenu from './DropdownMenu';
import NotificationPanel from './NotificationPanel';
import './styles.css';

const Navbar = ({ onOpenProfile }) => {
  const { 
    activePage, 
    setActivePage, 
    notifications, 
    userProfile, 
    simulateMealUpload, 
    patients,
    setSelectedPatientId
  } = useContext(AppContext);
  
  const [openDropdown, setOpenDropdown] = useState(null); // 'consultorio', 'estudos', 'marketing', 'ferramentas', 'suporte'
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = (name) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
      setIsNotificationsOpen(false);
    }
  };

  const handlePageSelect = (page, patientId = null) => {
    setActivePage(page);
    if (patientId) setSelectedPatientId(patientId);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  // Pre-load notification simulated action
  const handleSimulateUpdate = () => {
    // Pick a random patient
    const randomPatient = patients[Math.floor(Math.random() * patients.length)];
    const meals = [
      { name: 'Café da Manhã (Abacate, Ovos, Café)', photo: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=120&auto=format&fit=crop&q=80' },
      { name: 'Lanche da Tarde (Iogurte e Castanhas)', photo: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&auto=format&fit=crop&q=80' },
      { name: 'Jantar Leve (Sopa de Legumes com Frango)', photo: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=120&auto=format&fit=crop&q=80' }
    ];
    const randomMeal = meals[Math.floor(Math.random() * meals.length)];
    simulateMealUpload(randomPatient.id, randomMeal.name, randomMeal.photo);
    alert(`[Simulação] ${randomPatient.name} enviou uma nova foto de refeição! Verifique no Sino de Notificações.`);
  };

  // Dropdown Configurations
  const consultorioOptions = [
    { label: 'Pacientes', onClick: () => handlePageSelect('pacientes') },
    { label: 'Agendamentos', onClick: () => handlePageSelect('agendamentos') },
    { label: 'Pré-consulta', onClick: () => handlePageSelect('pacientes') }, // Redirect to Patient to send
    { label: 'Respostas pré-consulta', onClick: () => handlePageSelect('pacientes') },
    { label: 'Meus favoritos', onClick: () => handlePageSelect('pacientes') },
    { label: 'Meus alimentos', onClick: () => handlePageSelect('pacientes') },
    { label: 'Receitas culinárias', onClick: () => handlePageSelect('pacientes') },
    { label: 'Diário alimentar', onClick: () => handlePageSelect('diario') },
    { label: 'Financeiro', onClick: () => handlePageSelect('financeiro') },
    { label: 'Impressos', onClick: () => handlePageSelect('pacientes') },
    { label: 'Lixeira', onClick: () => handlePageSelect('pacientes') }
  ];

  const estudosOptions = [
    { label: 'Lâminas', onClick: () => handlePageSelect('estudos') },
    { label: 'Cursos completos', onClick: () => handlePageSelect('estudos') },
    { label: 'WebDiet Cast', onClick: () => handlePageSelect('estudos') },
    { label: 'Biblioteca científica', onClick: () => handlePageSelect('estudos') },
    { label: 'Casos clínicos', onClick: () => handlePageSelect('estudos') },
    { label: 'Pasta compartilhada', onClick: () => handlePageSelect('estudos') },
    { label: 'E-books', onClick: () => handlePageSelect('estudos') },
    { label: 'Blog', onClick: () => handlePageSelect('estudos') }
  ];

  const marketingOptions = [
    { label: 'WebDiet canvas', onClick: () => handlePageSelect('marketing') },
    { label: 'Mensagens do sistema', onClick: () => handlePageSelect('marketing') },
    { label: 'Modelos de mensagens', onClick: () => handlePageSelect('marketing') },
    { label: 'Benefícios para pacientes', onClick: () => handlePageSelect('marketing') },
    { label: 'NutriLinks', onClick: () => handlePageSelect('marketing') },
    { label: 'Criador de site', onClick: () => handlePageSelect('marketing') },
    { label: 'Mailing captado', onClick: () => handlePageSelect('marketing') }
  ];

  const ferramentasOptions = [
    { label: 'Videochamada', onClick: () => handlePageSelect('ferramentas') },
    { label: 'MoveHealth (Black)', onClick: () => handlePageSelect('ferramentas') },
    { label: 'Estatísticas', onClick: () => handlePageSelect('ferramentas') },
    { label: 'Benefícios para você', onClick: () => handlePageSelect('ferramentas') }
  ];

  const suporteOptions = [
    { label: 'Falar com Suporte', onClick: () => handlePageSelect('suporte') },
    { label: 'Central de Ajuda', onClick: () => handlePageSelect('suporte') },
    { label: 'Tutoriais em vídeo', onClick: () => handlePageSelect('suporte') },
    { label: 'Enviar Feedback', onClick: () => handlePageSelect('suporte') }
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

          {/* Marketing Dropdown */}
          <div className="nav-item-container">
            <button 
              className={`nav-btn ${openDropdown === 'marketing' ? 'open' : ''}`}
              onClick={() => toggleDropdown('marketing')}
            >
              Marketing <span className="chevron"></span>
            </button>
            <DropdownMenu 
              options={marketingOptions} 
              isOpen={openDropdown === 'marketing'} 
              onClose={() => setOpenDropdown(null)} 
            />
          </div>

          {/* Ferramentas Dropdown */}
          <div className="nav-item-container">
            <button 
              className={`nav-btn ${openDropdown === 'ferramentas' ? 'open' : ''}`}
              onClick={() => toggleDropdown('ferramentas')}
            >
              Ferramentas <span className="chevron"></span>
            </button>
            <DropdownMenu 
              options={ferramentasOptions} 
              isOpen={openDropdown === 'ferramentas'} 
              onClose={() => setOpenDropdown(null)} 
            />
          </div>

          {/* Suporte Dropdown */}
          <div className="nav-item-container">
            <button 
              className={`nav-btn ${openDropdown === 'suporte' ? 'open' : ''}`}
              onClick={() => toggleDropdown('suporte')}
            >
              Suporte <span className="chevron"></span>
            </button>
            <DropdownMenu 
              options={suporteOptions} 
              isOpen={openDropdown === 'suporte'} 
              onClose={() => setOpenDropdown(null)} 
            />
          </div>

          {/* Direct Buttons */}
          <button className={`nav-btn ${activePage === 'chat' ? 'active' : ''}`} onClick={() => handlePageSelect('chat')}>
            Ver chat
          </button>
          <button className="nav-btn" onClick={() => alert('Extensões carregadas!')}>
            Extensões
          </button>
          <button className="nav-btn" onClick={() => alert('Seus Vouchers WebFit: 10% OFF em suplementos parceiros!')}>
            Vouchers
          </button>
        </nav>
      </div>

      <div className="nav-right">
        {/* WhatsApp Icon with green border */}
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

        {/* Badge "20" Simulation button */}
        <button 
          className="icon-btn badge-purple" 
          onClick={handleSimulateUpdate}
          title="Simular interação de paciente (Diário Alimentar)"
        >
          20
        </button>

        {/* Notification Sino */}
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
        <button 
          className="icon-btn" 
          onClick={() => {
            handlePageSelect('marketing');
            alert('Atalhos Rápidos de Marketing abertos! Conheça nosso criador de site.');
          }}
          title="Aplicativos do Ecossistema"
        >
          <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
          </svg>
        </button>

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
