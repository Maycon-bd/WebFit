import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

interface PatientListWidgetProps {
  onAddPatientClick: () => void;
}

type FilterMode = 'recent' | 'aniversariantes';

const PatientListWidget: React.FC<PatientListWidgetProps> = ({ onAddPatientClick }) => {
  const { patients, setActivePage, setSelectedPatientId } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('recent');

  const handlePatientClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActivePage('pacientes');
  };

  const getFilteredPatients = () => {
    let result = [...patients];

    if (filterMode === 'aniversariantes') {
      const currentMonth = new Date().getMonth() + 1;
      result = result.filter(p => {
        if (!p.birthDate) return false;
        const month = parseInt(p.birthDate.split('-')[1]);
        return month === currentMonth;
      });
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(term);
        const nickMatch = p.nickname?.toLowerCase().includes(term);
        const cpfMatch = p.cpf?.includes(term);
        const phoneMatch = p.phone?.includes(term);
        const tagMatch = p.tags?.some(tag => tag.toLowerCase().includes(term));
        return nameMatch || nickMatch || cpfMatch || phoneMatch || tagMatch;
      });
    }

    return result;
  };

  const filteredList = getFilteredPatients();

  return (
    <div className="card">
      <div className="widget-header">
        <h2>
          Seus pacientes
          <span className="info-icon" title="Lista de pacientes recentes e opções de busca">?</span>
        </h2>
        <div className="links-top">
          <a href="#import" onClick={(e) => { e.preventDefault(); alert('Funcionalidade de Importação em lote: Selecione um arquivo Excel/CSV.'); }}>Importar pacientes</a>
          <span>|</span>
          <a href="#all" onClick={(e) => { e.preventDefault(); setActivePage('pacientes'); }}>Ver todos</a>
          <span>|</span>
          <a
            href="#bday"
            onClick={(e) => {
              e.preventDefault();
              setFilterMode(filterMode === 'aniversariantes' ? 'recent' : 'aniversariantes');
            }}
            style={{ fontWeight: filterMode === 'aniversariantes' ? 'bold' : 'normal', color: filterMode === 'aniversariantes' ? 'var(--primary-teal)' : '' }}
          >
            Aniversariantes {filterMode === 'aniversariantes' && '✓'}
          </a>
        </div>
      </div>

      <button className="btn-teal" onClick={onAddPatientClick} style={{ marginBottom: '16px' }}>
        + adicionar paciente
      </button>

      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="form-control search-input"
          placeholder="Busque pelo nome, apelido, CPF, telefone ou pela tag do paciente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="patients-widget-list">
        {filteredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
            Nenhum paciente encontrado.
          </div>
        ) : (
          filteredList.map((patient) => (
            <div
              key={patient.id}
              className="patient-widget-item"
              onClick={() => handlePatientClick(patient.id)}
            >
              <div className="patient-widget-avatar">
                <img
                  src={patient.gender === 'Masculino'
                    ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
                  }
                  alt="Perfil"
                />
              </div>
              <div className="patient-widget-info">
                <div className="patient-widget-name">{patient.name}</div>
                <div className="patient-widget-date">Modificado em {patient.lastModified}</div>
              </div>
              {patient.tags && patient.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  {patient.tags.slice(0, 1).map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '10px',
                        backgroundColor: 'var(--primary-teal-light)',
                        color: 'var(--text-teal)',
                        border: '1px solid var(--primary-teal-border)',
                        padding: '2px 6px',
                        borderRadius: '10px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {patient.tags.length > 1 && (
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                      +{patient.tags.length - 1}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientListWidget;
