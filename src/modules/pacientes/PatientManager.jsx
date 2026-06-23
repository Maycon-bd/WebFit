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
    setSelectedPatientId,
    triggerPatientCreate,
    setTriggerPatientCreate
  } = useContext(AppContext);

  const [mode, setMode] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [editingPatient, setEditingPatient] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true); // Open by default as in screenshot
  const [genderFilter, setGenderFilter] = useState('Sem especificar');
  const [sortOption, setSortOption] = useState('Data de modificação');
  const [modificationFilter, setModificationFilter] = useState('Todo período');
  const [creationFilter, setCreationFilter] = useState('Todo período');
  const [appLoginFilter, setAppLoginFilter] = useState('Sem especificar');

  // Sync state if selectedPatientId is set from context (e.g. clicking from dashboard or notifications)
  useEffect(() => {
    if (selectedPatientId) {
      setMode('view');
    } else {
      setMode('list');
    }
  }, [selectedPatientId]);

  // Sync state for quick action 'novo paciente'
  useEffect(() => {
    if (triggerPatientCreate) {
      setMode('create');
      setEditingPatient(null);
      setTriggerPatientCreate(false);
    }
  }, [triggerPatientCreate]);



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

  // Dynamic filtering & sorting logic
  const filteredPatients = patients
    .filter(patient => {
      // 1. Text Search query (by name, nickname, CPF, phone, or tags)
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = patient.name && patient.name.toLowerCase().includes(q);
        const matchesNickname = patient.nickname && patient.nickname.toLowerCase().includes(q);
        const matchesCpf = patient.cpf && patient.cpf.includes(q);
        const matchesPhone = patient.phone && patient.phone.includes(q);
        const matchesTags = patient.tags && patient.tags.some(tag => tag.toLowerCase().includes(q));
        
        if (!matchesName && !matchesNickname && !matchesCpf && !matchesPhone && !matchesTags) {
          return false;
        }
      }
      
      // 2. Gender filter
      if (genderFilter !== 'Sem especificar') {
        if (patient.gender !== genderFilter) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // 3. Sorting
      if (sortOption === 'Data de modificação') {
        const parseDate = (str) => {
          if (!str) return 0;
          const [datePart, timePart] = str.split(' - ');
          if (!datePart) return 0;
          const [d, m, y] = datePart.split('/');
          const [h, min, s] = (timePart || '00:00:00').split(':');
          return new Date(y, m - 1, d, h, min, s).getTime();
        };
        return parseDate(b.lastModified) - parseDate(a.lastModified);
      } else if (sortOption === 'Ordem alfabética') {
        return a.name.localeCompare(b.name);
      } else {
        return 0;
      }
    });

  return (
    <div className="main-content">
      {mode === 'list' && (
        <div className="patients-container">
          {/* Header area as in print */}
          <div className="patients-page-header-premium">
            <div className="header-left">
              <h1 className="header-title">Pacientes cadastrados</h1>
              <span className="header-subtitle">Total de pacientes: {patients.length + 53}</span>
            </div>
            <div className="header-right">
              <a href="#export" onClick={(e) => { e.preventDefault(); alert('Exportando pacientes...'); }} className="header-link">Exportar pacientes</a>
              <span className="header-separator">|</span>
              <a href="#disable" onClick={(e) => { e.preventDefault(); alert('Desativando materiais em massa...'); }} className="header-link">Desativar materiais em massa</a>
            </div>
          </div>
          
          {/* Large Lowercase teal button */}
          <button className="btn-teal-large-lowercase" onClick={handleAddPatientTrigger}>
            adicionar paciente
          </button>
          
          {/* Search Box */}
          <div className="patient-search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="search-input-field" 
              placeholder="Busque pelo nome, apelido, CPF, telefone ou pela tag do paciente"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className={`toggle-filters-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              exibir/ocultar filtros {showFilters ? '▲' : '▼'}
            </button>
          </div>

          {/* Filters Panel (collapsible) */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filter-row">
                <span className="filter-label">Data de modificação:</span>
                <div className="filter-options">
                  {['Todo período', '1 mês atrás', '2 meses atrás', '3 meses atrás', 'Personalizar data'].map((option) => (
                    <button 
                      key={option} 
                      className={`filter-btn ${modificationFilter === option ? 'active' : ''}`}
                      onClick={() => setModificationFilter(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-row">
                <span className="filter-label">Data de criação:</span>
                <div className="filter-options">
                  {['Todo período', '1 mês atrás', '2 meses atrás', '3 meses atrás', 'Personalizar data'].map((option) => (
                    <button 
                      key={option} 
                      className={`filter-btn ${creationFilter === option ? 'active' : ''}`}
                      onClick={() => setCreationFilter(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-row">
                <span className="filter-label">Logou no app:</span>
                <div className="filter-options">
                  {['Sem especificar', 'Sim', 'Não'].map((option) => (
                    <button 
                      key={option} 
                      className={`filter-btn ${appLoginFilter === option ? 'active' : ''}`}
                      onClick={() => setAppLoginFilter(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-row">
                <span className="filter-label">Gênero do paciente:</span>
                <div className="filter-options">
                  {['Sem especificar', 'Masculino', 'Feminino'].map((option) => (
                    <button 
                      key={option} 
                      className={`filter-btn ${genderFilter === option ? 'active' : ''}`}
                      onClick={() => setGenderFilter(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-row">
                <span className="filter-label">Ordenar resultados por:</span>
                <div className="filter-options">
                  {['Data de modificação', 'Data de cadastro', 'Ordem alfabética', 'Login no app'].map((option) => (
                    <button 
                      key={option} 
                      className={`filter-btn ${sortOption === option ? 'active' : ''}`}
                      onClick={() => setSortOption(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Patient Cards Grid */}
          <div className="patients-grid-list-premium">
            {filteredPatients.map(patient => (
              <div 
                key={patient.id} 
                className="patient-grid-card-premium" 
                onClick={() => handlePatientSelect(patient.id)}
              >
                <div className="patient-card-header-premium">
                  <div className="patient-card-avatar-premium">
                    <img 
                      src={patient.gender === 'Masculino' 
                        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' 
                        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
                      } 
                      alt="Perfil" 
                    />
                  </div>
                  <div className="patient-card-info-premium">
                    <div className="patient-card-title-premium">{patient.name}</div>
                    <div className="patient-card-modified-premium">Modificado em {patient.lastModified}</div>
                  </div>
                </div>
                
                {/* Tags and '+ nova tag' button */}
                <div className="patient-card-tags-area" onClick={(e) => e.stopPropagation()}>
                  {patient.tags && patient.tags.map((tag, idx) => (
                    <span key={idx} className="patient-tag-badge-premium">
                      {tag}
                      <button 
                        className="patient-tag-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePatient({
                            ...patient,
                            tags: patient.tags.filter(t => t !== tag)
                          });
                        }}
                        title="Remover tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button 
                    className="patient-add-tag-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTag = prompt('Digite o nome da nova tag:');
                      if (newTag && newTag.trim() !== '') {
                        updatePatient({
                          ...patient,
                          tags: [...(patient.tags || []), newTag.trim()]
                        });
                      }
                    }}
                  >
                    + nova tag
                  </button>
                </div>
              </div>
            ))}
            {filteredPatients.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                Nenhum paciente encontrado com os filtros selecionados.
              </div>
            )}
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
