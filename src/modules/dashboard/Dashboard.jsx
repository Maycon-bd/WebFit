import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import PatientListWidget from './PatientListWidget';
import PlannerWidget from './PlannerWidget';
import AppSettingsWidget from './AppSettingsWidget';
import ConsultationChart from './ConsultationChart';
import './styles.css';

const Dashboard = ({ onAddPatientClick }) => {
  const { 
    userProfile, 
    toggleBlackStatus, 
    prescriptions, 
    setActivePage, 
    setSelectedPatientId 
  } = useContext(AppContext);

  // Mock list for Comunidade
  const communityTopics = [
    { id: 'c1', title: 'Cirurgia de retirada de vesícula', date: 'Atualizado em 19/06/2026 - 10:58' },
    { id: 'c2', title: 'Pós operatório, paciente em processo de emagrecimento', date: 'Atualizado em 19/06/2026 - 09:29' },
    { id: 'c3', title: 'App paciente - Dúvidas sobre diário de fotos', date: 'Atualizado em 18/06/2026 - 15:46' },
    { id: 'c4', title: 'Quais estratégias para adquirir pacientes?', date: 'Atualizado em 18/06/2026 - 09:45' },
    { id: 'c5', title: 'Gestante bebê com percentil relativamente abaixo', date: 'Atualizado em 17/06/2026 - 23:22' }
  ];

  const handlePrescriptionClick = (patientId) => {
    if (patientId) {
      setSelectedPatientId(patientId);
      setActivePage('pacientes');
    }
  };

  return (
    <div className="main-content">
      {/* WebDiet Black Banner */}
      <div 
        className="gold-banner" 
        onClick={toggleBlackStatus}
        style={{ cursor: 'pointer', transition: 'var(--transition-fast)' }}
        title="Clique para assinar / cancelar o plano WebDiet Black"
      >
        <span>👑</span>
        <span>
          {userProfile.isBlack 
            ? 'Você é um membro WebDiet Black! Aproveite o MoveHealth, iMetas e recursos de IA.' 
            : 'Conheça o Webdiet Black e desbloqueie o MoveHealth, iMetas e mais IA para turbinar seus atendimentos'}
        </span>
        <span>👑</span>
      </div>

      {/* Main Grid: Patients & Planner */}
      <div className="dashboard-grid">
        <PatientListWidget onAddPatientClick={onAddPatientClick} />
        <PlannerWidget />
      </div>

      {/* Accordion: App Settings */}
      <AppSettingsWidget />

      {/* SVG Bar Chart: Consultation History */}
      <ConsultationChart />

      <div style={{ height: '24px' }}></div>

      {/* Bottom Grid: Community & Recent Prescriptions */}
      <div className="dashboard-grid-small">
        {/* Community */}
        <div className="card">
          <div className="widget-header">
            <h2>
              Comunidade WebDiet
              <span className="info-icon" title="Fórum de discussões científicas e de negócios entre os nutricionistas cadastrados">?</span>
            </h2>
            <div className="links-top">
              <a href="#com" onClick={(e) => { e.preventDefault(); alert('Abrindo fórum completo da Comunidade WebDiet...'); }}>Ver todos os tópicos</a>
            </div>
          </div>
          <div className="comm-presc-list">
            {communityTopics.map(topic => (
              <div 
                key={topic.id} 
                className="comm-presc-card"
                onClick={() => alert(`Visualizando tópico: "${topic.title}"`)}
              >
                <div className="comm-title">{topic.title}</div>
                <div className="comm-date">{topic.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Prescriptions */}
        <div className="card">
          <div className="widget-header">
            <h2>
              Prescrições recentes
              <span className="info-icon" title="Visualização rápida das últimas prescrições alimentares emitidas">?</span>
            </h2>
          </div>
          <div className="comm-presc-list">
            {prescriptions.slice(0, 5).map(presc => (
              <div 
                key={presc.id} 
                className="comm-presc-card"
                onClick={() => handlePrescriptionClick(presc.patientId)}
              >
                <div className="presc-type">{presc.type}</div>
                <div className="presc-details">
                  Emitido em {presc.date} para <strong>{presc.patientName}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
