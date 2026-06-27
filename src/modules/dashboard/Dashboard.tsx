import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import PatientListWidget from './PatientListWidget';
import PlannerWidget from './PlannerWidget';
import AppSettingsWidget from './AppSettingsWidget';
import ConsultationChart from './ConsultationChart';
import './styles.css';

interface DashboardProps {
  onAddPatientClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAddPatientClick }) => {
  const {
    prescriptions,
    setActivePage,
    setSelectedPatientId,
  } = useContext(AppContext);

  const handlePrescriptionClick = (patientId: string) => {
    if (patientId) {
      setSelectedPatientId(patientId);
      setActivePage('pacientes');
    }
  };

  return (
    <div className="main-content">
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

      {/* Bottom: Prescrições Recentes */}
      <div className="card prescricoes-full-card">
        <div className="widget-header">
          <h2>
            <span className="presc-icon">📋</span>
            Prescrições Recentes
            <span className="info-icon" title="Visualização rápida das últimas prescrições alimentares emitidas">?</span>
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Clique em uma prescrição para abrir o perfil do paciente</span>
        </div>
        <div className="prescricoes-grid">
          {prescriptions.slice(0, 6).map(presc => (
            <div
              key={presc.id}
              className="presc-card-full"
              onClick={() => handlePrescriptionClick(presc.patientId)}
            >
              <div className="presc-card-icon">🥗</div>
              <div className="presc-card-body">
                <div className="presc-type">{presc.type}</div>
                <div className="presc-details">
                  <strong>{presc.patientName}</strong>
                </div>
                <div className="presc-date">Emitido em {presc.date}</div>
              </div>
              <div className="presc-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
