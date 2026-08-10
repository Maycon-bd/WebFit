import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import PatientForm from './PatientForm';
import PatientProfile from './PatientProfile';
import type { Patient } from '../../types';
import '../../styles/patients.css';

type PatientManagerMode = 'list' | 'create' | 'edit' | 'view';
type SortOption = 'Data de modificação' | 'Data de cadastro' | 'Ordem alfabética' | 'Login no app';

const PatientManager: React.FC = () => {
  const { 
    patients, 
    addPatient, 
    updatePatient, 
    deletePatient,
    selectedPatientId, 
    setSelectedPatientId,
    triggerPatientCreate,
    setTriggerPatientCreate,
    dataLoading,
    dataError,
    refreshClinicalData,
  } = useContext(AppContext);

  const [mode, setMode] = useState<PatientManagerMode>('list');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [genderFilter, setGenderFilter] = useState('Sem especificar');
  const [sortOption, setSortOption] = useState<SortOption>('Data de modificação');
  const [modificationFilter, setModificationFilter] = useState('Todo período');
  const [creationFilter, setCreationFilter] = useState('Todo período');
  const [appLoginFilter, setAppLoginFilter] = useState('Sem especificar');

  // Sync state if selectedPatientId is set from context
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
  }, [triggerPatientCreate, setTriggerPatientCreate]);

  const handleSave = async (patientData: Partial<Patient> & { name: string }) => {
    setOperationError(null);
    try {
      if (patientData.id) {
        await updatePatient(patientData as Partial<Patient> & { id: string });
        setSelectedPatientId(patientData.id);
        setMode('view');
      } else {
        const created = await addPatient({
          name: patientData.name,
          nickname: patientData.nickname || '',
          cpf: patientData.cpf || '',
          phone: patientData.phone || '',
          email: patientData.email || '',
          gender: patientData.gender || 'Feminino',
          birthDate: patientData.birthDate || '',
          tags: patientData.tags || [],
          notes: patientData.notes || ''
        });
        setSelectedPatientId(created.id);
        setMode('view');
      }
      setEditingPatient(null);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Não foi possível salvar o paciente.';
      setOperationError(message);
      throw cause;
    }
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

  const handleEditClick = (patient: Patient) => {
    setEditingPatient(patient);
    setMode('edit');
  };

  const handleDelete = async (patient: Patient) => {
    if (!window.confirm(`Arquivar ${patient.name}? O paciente sairá das telas ativas, mas seu histórico e a auditoria serão preservados.`)) return;
    setOperationError(null);
    try {
      await deletePatient(patient.id);
      setEditingPatient(null);
      setSelectedPatientId(null);
      setMode('list');
    } catch (cause) {
      setOperationError(cause instanceof Error ? cause.message : 'Não foi possível arquivar o paciente.');
    }
  };

  const handlePatientSelect = (patientId: string) => {
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
      
      if (genderFilter !== 'Sem especificar') {
        if (patient.gender !== genderFilter) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'Data de modificação') {
        const parseDate = (str: string) => {
          if (!str) return 0;
          const [datePart, timePart] = str.split(' - ');
          if (!datePart) return 0;
          const [d, m, y] = datePart.split('/');
          const [h, min, s] = (timePart || '00:00:00').split(':');
          return new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min), parseInt(s)).getTime();
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
      {mode !== 'list' && (dataError || operationError) && (
        <div className="data-feedback error" role="alert">
          <span>{operationError ?? dataError}</span>
          <button type="button" onClick={() => void refreshClinicalData()}>Tentar novamente</button>
        </div>
      )}
      {mode === 'list' && (
        <div className="patients-container">
          <div className="patients-page-header-premium">
            <div className="header-left">
              <h1 className="header-title">Pacientes cadastrados</h1>
              <span className="header-subtitle">Total de pacientes: {patients.length}</span>
            </div>
            <div className="header-right">
              <a href="#export" onClick={(e) => { e.preventDefault(); alert('Exportando pacientes...'); }} className="header-link">Exportar pacientes</a>
              <span className="header-separator">|</span>
              <a href="#disable" onClick={(e) => { e.preventDefault(); alert('Desativando materiais em massa...'); }} className="header-link">Desativar materiais em massa</a>
            </div>
          </div>
          
          <button className="btn-teal-large-lowercase" onClick={handleAddPatientTrigger}>
            adicionar paciente
          </button>

          {(dataError || operationError) && (
            <div className="data-feedback error" role="alert">
              <span>{operationError ?? dataError}</span>
              <button type="button" onClick={() => void refreshClinicalData()}>Tentar novamente</button>
            </div>
          )}
          
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
                      onClick={() => setSortOption(option as SortOption)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="patients-grid-list-premium">
            {!dataLoading && filteredPatients.map(patient => (
              <div 
                key={patient.id} 
                className="patient-grid-card-premium" 
                onClick={() => handlePatientSelect(patient.id)}
              >
                <div className="patient-card-header-premium">
                  <div className="patient-card-avatar-premium" aria-hidden="true">
                    <span>{patient.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()}</span>
                  </div>
                  <div className="patient-card-info-premium">
                    <div className="patient-card-title-premium">{patient.name}</div>
                    <div className="patient-card-modified-premium">Modificado em {patient.lastModified}</div>
                  </div>
                </div>
                
                <div className="patient-card-tags-area" onClick={(e) => e.stopPropagation()}>
                  {patient.tags && patient.tags.map((tag, idx) => (
                    <span key={idx} className="patient-tag-badge-premium">
                      {tag}
                      <button 
                        className="patient-tag-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          void updatePatient({
                            id: patient.id,
                            tags: patient.tags.filter(t => t !== tag)
                          }).catch((cause) => setOperationError(cause instanceof Error ? cause.message : 'Não foi possível remover a tag.'));
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
                        void updatePatient({
                          id: patient.id,
                          tags: [...(patient.tags || []), newTag.trim()]
                        }).catch((cause) => setOperationError(cause instanceof Error ? cause.message : 'Não foi possível adicionar a tag.'));
                      }
                    }}
                  >
                    + nova tag
                  </button>
                </div>
              </div>
            ))}
            {dataLoading && (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }} role="status">
                <strong>Carregando pacientes…</strong>
                <span>Buscando os dados protegidos da clínica.</span>
              </div>
            )}
            {!dataLoading && filteredPatients.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <strong>{patients.length === 0 ? 'Sua clínica ainda não possui pacientes.' : 'Nenhum paciente encontrado.'}</strong>
                <div style={{ marginTop: '8px' }}>{patients.length === 0 ? 'Cadastre o primeiro paciente para começar.' : 'Ajuste os filtros ou a busca.'}</div>
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
          onDelete={handleDelete}
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
