import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const Scheduler: React.FC = () => {
  const { 
    appointments, 
    addAppointment, 
    cancelAppointment, 
    patients,
    triggerAppointmentCreate,
    setTriggerAppointmentCreate,
    dataLoading,
    dataError,
    refreshClinicalData,
    setActivePage,
  } = useContext(AppContext);
  
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<'Presencial' | 'Online'>('Presencial');
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPatientId && patients[0]) setSelectedPatientId(patients[0].id);
  }, [patients, selectedPatientId]);

  // Sync state for quick action 'novo agendamento'
  useEffect(() => {
    if (triggerAppointmentCreate) {
      setIsAdding(true);
      setTriggerAppointmentCreate(false);
    }
  }, [triggerAppointmentCreate, setTriggerAppointmentCreate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPatientId) {
      alert('Selecione um paciente!');
      return;
    }
    
    setSubmitting(true);
    setOperationError(null);
    try {
      await addAppointment({ patientId: selectedPatientId, date, time, type });
      setIsAdding(false);
    } catch (cause) {
      setOperationError(cause instanceof Error ? cause.message : 'Não foi possível agendar a consulta.');
    } finally {
      setSubmitting(false);
    }
  };

  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
  });

  return (
    <div className="main-content">
      <div className="patients-page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px' }}>Agenda & Agendamentos</h1>
        <button className="btn-teal" style={{ width: 'auto' }} onClick={() => setIsAdding(!isAdding)} disabled={!isAdding && patients.length === 0}>
          {isAdding ? 'Ver Compromissos' : '+ Agendar Consulta'}
        </button>
      </div>

      {(dataError || operationError) && (
        <div className="data-feedback error" role="alert">
          <span>{operationError ?? dataError}</span>
          <button type="button" onClick={() => void refreshClinicalData()}>Tentar novamente</button>
        </div>
      )}

      {isAdding ? (
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Agendar Novo Atendimento</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Paciente</label>
              <select 
                className="form-control" 
                value={selectedPatientId} 
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                <option value="">Selecione um paciente...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid-2col" style={{ gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Data</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Horário</label>
                <input 
                  type="time" 
                  className="form-control" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Modalidade</label>
              <select className="form-control" value={type} onChange={(e) => setType(e.target.value as 'Presencial' | 'Online')}>
                <option value="Presencial">Presencial (Consultório Principal)</option>
                <option value="Online">Online (Teleconsulta Videochamada)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button type="submit" className="btn-teal" disabled={submitting}>{submitting ? 'Agendando…' : 'Agendar'}</button>
              <button 
                type="button" 
                className="btn-teal" 
                style={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={() => setIsAdding(false)}
                disabled={submitting}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="card">
            <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Lista de Compromissos Cadastrados</h2>
            {dataLoading && <div className="empty-state" role="status"><strong>Carregando agenda…</strong></div>}
            {!dataLoading && patients.length === 0 && (
              <div className="empty-state">
                <strong>Cadastre um paciente antes de criar a primeira consulta.</strong>
                <button type="button" className="btn-teal" onClick={() => setActivePage('pacientes')}>Cadastrar paciente</button>
              </div>
            )}
            {!dataLoading && patients.length > 0 && sortedAppointments.length === 0 && (
              <div className="empty-state">
                <strong>Nenhum atendimento agendado.</strong>
                <span>Use “Agendar consulta” para criar o primeiro compromisso.</span>
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Data</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Horário</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Paciente</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Modalidade</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {!dataLoading && sortedAppointments.map(ap => {
                    const formattedDate = ap.date.split('-').reverse().join('/');
                    return (
                      <tr key={ap.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '12px 8px' }}>{formattedDate}</td>
                        <td style={{ padding: '12px 8px' }}>{ap.time}</td>
                        <td style={{ padding: '12px 8px', fontWeight: '600' }}>{ap.patientName}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ 
                            fontSize: '11.5px', 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            backgroundColor: ap.type === 'Online' ? 'rgba(192, 132, 252, 0.1)' : 'var(--primary-teal-light)',
                            color: ap.type === 'Online' ? '#c084fc' : 'var(--text-teal)',
                            border: ap.type === 'Online' ? '1px solid rgba(192, 132, 252, 0.2)' : '1px solid var(--primary-teal-border)'
                          }}>
                            {ap.type}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ color: ap.status === 'Realizada' ? 'var(--color-success)' : ap.status === 'Cancelada' ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                            {ap.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          {ap.status !== 'Cancelada' && <button
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: 'var(--color-danger)', 
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '13px'
                            }} 
                            onClick={async () => {
                              if (window.confirm(`Deseja realmente desmarcar a consulta de ${ap.patientName}?`)) {
                                setOperationError(null);
                                try {
                                  await cancelAppointment(ap.id);
                                } catch (cause) {
                                  setOperationError(cause instanceof Error ? cause.message : 'Não foi possível cancelar a consulta.');
                                }
                              }
                            }}
                          >
                            Desmarcar
                          </button>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
