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
    patients,
    appointments,
    financials,
    plannerTasks,
    userProfile,
    setActivePage,
    setSelectedPatientId,
  } = useContext(AppContext);

  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const upcomingAppointments = appointments.filter(item => item.date >= todayIso && item.status !== 'Cancelada').length;
  const openTasks = plannerTasks.filter(item => !item.done).length;
  const totalRevenue = financials.reduce((total, item) => total + item.value, 0);
  const firstName = userProfile.name.replace(/^(Dra?\.?|Dr\.?)/i, '').trim().split(' ')[0] || userProfile.name;

  const handlePrescriptionClick = (patientId: string) => {
    if (patientId) {
      setSelectedPatientId(patientId);
      setActivePage('pacientes');
    }
  };

  return (
    <div className="main-content">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span className="eyebrow">Visão do consultório</span>
          <h1>Bom dia, {firstName}.</h1>
          <p>{today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} · Aqui está o pulso da sua operação clínica.</p>
        </div>
        <button className="hero-action" onClick={onAddPatientClick}><span>+</span> Novo paciente</button>
      </section>

      <section className="health-metrics" aria-label="Resumo do consultório">
        <button onClick={() => setActivePage('pacientes')} className="health-metric"><span className="metric-symbol patients">PA</span><span><strong>{patients.length}</strong><small>Pacientes ativos</small></span><i>↗</i></button>
        <button onClick={() => setActivePage('agendamentos')} className="health-metric"><span className="metric-symbol agenda">AG</span><span><strong>{upcomingAppointments}</strong><small>Próximos atendimentos</small></span><i>↗</i></button>
        <button onClick={() => setActivePage('financeiro')} className="health-metric"><span className="metric-symbol revenue">R$</span><span><strong>{totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</strong><small>Receita registrada</small></span><i>↗</i></button>
        <div className="health-metric"><span className="metric-symbol tasks">PL</span><span><strong>{openTasks}</strong><small>Tarefas em aberto</small></span></div>
      </section>

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
