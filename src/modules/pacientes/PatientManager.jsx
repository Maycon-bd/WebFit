import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import PatientListWidget from '../dashboard/PatientListWidget';
import PatientForm from './PatientForm';
import PatientProfile from './PatientProfile';
import '../../styles/patients.css';

const PatientManager = () => {
  const { 
    patients, 
    addPatient, 
    updatePatient, 
    selectedPatientId, 
    setSelectedPatientId 
  } = useContext(AppContext);

  const [mode, setMode] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [editingPatient, setEditingPatient] = useState(null);

  // Sync state if selectedPatientId is set from context (e.g. clicking from dashboard or notifications)
  useEffect(() => {
    if (selectedPatientId) {
      setMode('view');
    }
  }, [selectedPatientId]);

  const handleSave = (patientData) => {
    if (patientData.id) {
      updatePatient(patientData);
      setSelectedPatientId(patientData.id);
      setMode('view');
    } else {
      const created = addPatient(patientData);
      setSelectedPatientId(created.id);
      setMode('view');
    }
    setEditingPatient(null);
  };

  const handleCancel = () => {
    if (editingPatient) {
      setMode('view');
    } else {
      setMode('list');
      setSelectedPatientId(null);
    }
    setEditingPatient(null);
  };

  const handleEditClick = (patient) => {
    setEditingPatient(patient);
    setMode('edit');
  };

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    setMode('view');
  };

  const handleAddPatientTrigger = () => {
    setEditingPatient(null);
    setSelectedPatientId(null);
    setMode('create');
  };

  const activePatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="main-content">
      {mode === 'list' && (
        <div className="patients-container">
          <div className="patients-page-header">
            <h1 style={{ fontSize: '20px' }}>Gestão de Pacientes</h1>
            <button className="btn-teal" style={{ width: 'auto' }} onClick={handleAddPatientTrigger}>
              + Novo Paciente
            </button>
          </div>
          
          <div className="patients-grid-list">
            {patients.map(patient => (
              <div 
                key={patient.id} 
                className="patient-grid-card" 
                onClick={() => handlePatientSelect(patient.id)}
              >
                <div className="patient-card-header">
                  <div className="patient-card-avatar">
                    <img 
                      src={patient.gender === 'Masculino' 
                        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' 
                        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
                      } 
                      alt="Perfil" 
                    />
                  </div>
                  <div>
                    <div className="patient-card-title">{patient.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Apelido: {patient.nickname}</div>
                  </div>
                </div>
                <div className="patient-card-details">
                  <div><strong>WhatsApp:</strong> {patient.phone}</div>
                  <div><strong>CPF:</strong> {patient.cpf}</div>
                  <div><strong>Modificado em:</strong> {patient.lastModified}</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                  {patient.tags && patient.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        fontSize: '9.5px', 
                        backgroundColor: 'var(--primary-teal-light)', 
                        color: 'var(--text-teal)', 
                        border: '1px solid var(--primary-teal-border)',
                        padding: '1px 5px',
                        borderRadius: '8px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(mode === 'create' || mode === 'edit') && (
        <PatientForm 
          patient={editingPatient} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      )}

      {mode === 'view' && activePatient && (
        <PatientProfile 
          patient={activePatient} 
          onEdit={handleEditClick} 
          onBack={() => {
            setMode('list');
            setSelectedPatientId(null);
          }} 
        />
      )}
    </div>
  );
};

export default PatientManager;
