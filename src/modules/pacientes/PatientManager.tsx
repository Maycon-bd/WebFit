import React, { useContext, useEffect, useMemo, useState } from 'react';
import MasterCrudLayout from '../../components/MasterCrudLayout';
import MestreFiltro from '../../components/MestreFiltro';
import { AppContext } from '../../context/AppContext';
import type { Patient } from '../../types';
import PatientForm from './PatientForm';
import PatientProfile from './PatientProfile';
import '../../styles/patients.css';

type PatientManagerMode = 'list' | 'create' | 'edit' | 'view';
type SearchOperation = 'LIKE_C' | 'NOT_LIKE' | 'LIKE_I' | 'LIKE_F' | '=' | '<>' | '>' | '>=' | '<' | '<=' | 'BETWEEN';
type SortOption = 'modified' | 'alphabetical' | 'status';

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();

const patientSearchValues = (patient: Patient, field: string): string[] => {
  const values: Record<string, string[]> = {
    name: [patient.name], nickname: [patient.nickname], cpf: [patient.cpf],
    phone: [patient.phone], email: [patient.email], tags: patient.tags,
  };
  return field ? (values[field] ?? []) : Object.values(values).flat();
};

const matchesOperation = (source: string, query: string, operation: SearchOperation, queryEnd = '') => {
  const value = normalize(source);
  if (operation === 'LIKE_I') return value.startsWith(query);
  if (operation === 'LIKE_F') return value.endsWith(query);
  if (operation === '=') return value === query;
  if (operation === '<>') return value !== query;
  if (operation === 'NOT_LIKE') return !value.includes(query);
  if (operation === '>') return value > query;
  if (operation === '>=') return value >= query;
  if (operation === '<') return value < query;
  if (operation === '<=') return value <= query;
  if (operation === 'BETWEEN') return value >= query && (!queryEnd || value <= queryEnd);
  return value.includes(query);
};

const patientInitials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

const parseModifiedDate = (value: string) => {
  const [datePart, timePart = '00:00:00'] = value.split(' - ');
  const [day, month, year] = (datePart ?? '').split('/').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  if (!day || !month || !year) return 0;
  return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0).getTime();
};

const downloadPatientsCsv = (patients: Patient[]) => {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const rows = [
    ['Nome', 'Apelido', 'CPF', 'Telefone', 'E-mail', 'Gênero', 'Status', 'Última modificação', 'Tags'],
    ...patients.map((patient) => [patient.name, patient.nickname, patient.cpf, patient.phone, patient.email, patient.gender, patient.status, patient.lastModified, patient.tags.join(', ')]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => escape(cell ?? '')).join(';')).join('\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pacientes-webfit.csv';
  link.click();
  URL.revokeObjectURL(url);
};

const PatientManager: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient, selectedPatientId, setSelectedPatientId,
    triggerPatientCreate, setTriggerPatientCreate, dataLoading, dataError, refreshClinicalData } = useContext(AppContext);
  const [mode, setMode] = useState<PatientManagerMode>('list');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [searchField, setSearchField] = useState('');
  const [searchOperation, setSearchOperation] = useState<SearchOperation>('LIKE_C');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryEnd, setSearchQueryEnd] = useState('');
  const [appliedSearch, setAppliedSearch] = useState({ field: '', operation: 'LIKE_C' as SearchOperation, query: '', queryEnd: '' });
  const [genderFilter, setGenderFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('modified');

  useEffect(() => { setMode(selectedPatientId ? 'view' : 'list'); }, [selectedPatientId]);
  useEffect(() => {
    if (!triggerPatientCreate) return;
    setMode('create'); setEditingPatient(null); setTriggerPatientCreate(false);
  }, [triggerPatientCreate, setTriggerPatientCreate]);

  const filteredPatients = useMemo(() => {
    const query = normalize(appliedSearch.query);
    const queryEnd = normalize(appliedSearch.queryEnd);
    return patients.filter((patient) => {
      if (genderFilter && patient.gender !== genderFilter) return false;
      if (!query) return true;
      const values = patientSearchValues(patient, appliedSearch.field);
      return appliedSearch.operation === 'NOT_LIKE'
        ? values.every((value) => matchesOperation(value ?? '', query, appliedSearch.operation, queryEnd))
        : values.some((value) => matchesOperation(value ?? '', query, appliedSearch.operation, queryEnd));
    }).sort((a, b) => {
      if (sortOption === 'alphabetical') return a.name.localeCompare(b.name, 'pt-BR');
      if (sortOption === 'status') return a.status.localeCompare(b.status, 'pt-BR') || a.name.localeCompare(b.name, 'pt-BR');
      return parseModifiedDate(b.lastModified) - parseModifiedDate(a.lastModified);
    });
  }, [appliedSearch, genderFilter, patients, sortOption]);

  const activePatient = patients.find((patient) => patient.id === selectedPatientId);

  const handleSave = async (patientData: Partial<Patient> & { name: string }) => {
    setOperationError(null);
    try {
      if (patientData.id) {
        await updatePatient(patientData as Partial<Patient> & { id: string });
        setSelectedPatientId(patientData.id);
      } else {
        const created = await addPatient({ name: patientData.name, nickname: patientData.nickname || '', cpf: patientData.cpf || '',
          phone: patientData.phone || '', email: patientData.email || '', gender: patientData.gender || 'Feminino',
          birthDate: patientData.birthDate || '', tags: patientData.tags || [], notes: patientData.notes || '' });
        setSelectedPatientId(created.id);
      }
      setEditingPatient(null); setMode('view');
    } catch (cause) {
      setOperationError(cause instanceof Error ? cause.message : 'Não foi possível salvar o paciente.');
      throw cause;
    }
  };

  const handleDelete = async (patient: Patient) => {
    if (!window.confirm(`Arquivar ${patient.name}? O histórico e a auditoria serão preservados.`)) return;
    setOperationError(null);
    try { await deletePatient(patient.id); setEditingPatient(null); setSelectedPatientId(null); setMode('list'); }
    catch (cause) { setOperationError(cause instanceof Error ? cause.message : 'Não foi possível arquivar o paciente.'); }
  };

  const openPatient = (patientId: string) => { setSelectedPatientId(patientId); setMode('view'); };
  const startCreate = () => { setEditingPatient(null); setSelectedPatientId(null); setMode('create'); };
  const clearFilters = () => {
    setAppliedSearch({ field: searchField, operation: 'LIKE_C', query: '', queryEnd: '' });
    setGenderFilter('');
  };

  if (mode === 'create' || mode === 'edit') return (
    <div className="main-content">
      {operationError && <div className="data-feedback error" role="alert">{operationError}</div>}
      <PatientForm patient={editingPatient} onSave={handleSave} onCancel={() => {
        setMode(editingPatient ? 'view' : 'list'); if (!editingPatient) setSelectedPatientId(null); setEditingPatient(null);
      }} />
    </div>
  );

  if (mode === 'view' && activePatient) return (
    <div className="main-content">
      {(dataError || operationError) && <div className="data-feedback error" role="alert"><span>{operationError ?? dataError}</span><button type="button" onClick={() => void refreshClinicalData()}>Tentar novamente</button></div>}
      <PatientProfile patient={activePatient} onEdit={(patient) => { setEditingPatient(patient); setMode('edit'); }} onDelete={handleDelete}
        onBack={() => { setMode('list'); setSelectedPatientId(null); }} />
    </div>
  );

  const icon = <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6m3-3h-6" /></svg>;
  return (
    <div className="main-content">
      <MasterCrudLayout title="Pacientes" subtitle={`${patients.length} ${patients.length === 1 ? 'paciente cadastrado' : 'pacientes cadastrados'}`} icon={icon}
        loading={dataLoading} loadingMessage="Buscando os dados protegidos da clínica..." actions={[
          { label: 'Exportar', disabled: filteredPatients.length === 0 || dataLoading, onClick: () => downloadPatientsCsv(filteredPatients), icon: <svg viewBox="0 0 24 24"><path d="M12 3v12m-4-4 4 4 4-4" /><path d="M5 19h14" /></svg> },
          { label: 'Novo paciente', variant: 'primary', onClick: startCreate, icon: <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg> },
        ]}>
        {(dataError || operationError) && <div className="data-feedback error" role="alert"><span>{operationError ?? dataError}</span><button type="button" onClick={() => void refreshClinicalData()}>Tentar novamente</button></div>}
        <MestreFiltro fields={[{ label: 'Nome', value: 'name' }, { label: 'Apelido', value: 'nickname' }, { label: 'CPF', value: 'cpf' },
          { label: 'Telefone', value: 'phone' }, { label: 'E-mail', value: 'email' }, { label: 'Tag', value: 'tags' }]}
          searchCols={['name', 'nickname', 'cpf', 'phone', 'email', 'tags']}
          onSearch={() => setAppliedSearch({ field: searchField, operation: searchOperation, query: searchQuery, queryEnd: searchQueryEnd })}
          onClear={clearFilters} isLoading={dataLoading}
          persistentState={{ coluna: searchField, setColuna: setSearchField, operacao: searchOperation, setOperacao: (value) => setSearchOperation(value as SearchOperation), texto: searchQuery, setTexto: setSearchQuery, textoFim: searchQueryEnd, setTextoFim: setSearchQueryEnd }}>
          <label className="master-field patient-filter-gender"><span>Gênero</span><select value={genderFilter} onChange={(event) => setGenderFilter(event.target.value)} disabled={dataLoading}><option value="">Todos</option><option value="Feminino">Feminino</option><option value="Masculino">Masculino</option></select></label>
          <label className="master-field patient-filter-sort"><span>Ordenar por</span><select value={sortOption} onChange={(event) => setSortOption(event.target.value as SortOption)} disabled={dataLoading}><option value="modified">Última modificação</option><option value="alphabetical">Ordem alfabética</option><option value="status">Status</option></select></label>
        </MestreFiltro>
        <section className="patient-master-grid" aria-label="Lista de pacientes">
          <header className="patient-master-grid-header"><div><strong>Pacientes encontrados</strong><span>{filteredPatients.length} de {patients.length} registros</span></div></header>
          {filteredPatients.length > 0 ? <div className="patient-table-scroll"><table className="patient-table"><thead><tr><th>Paciente</th><th>Contato</th><th>Gênero</th><th>Tags</th><th>Status</th><th>Última modificação</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>
            {filteredPatients.map((patient) => <tr key={patient.id} onDoubleClick={() => openPatient(patient.id)}>
              <td><button type="button" className="patient-table-person" onClick={() => openPatient(patient.id)}><span className="patient-table-avatar" aria-hidden="true">{patientInitials(patient.name)}</span><span><strong>{patient.name}</strong><small>{patient.nickname || patient.cpf || 'Sem identificação adicional'}</small></span></button></td>
              <td><span className="patient-table-main-value">{patient.phone || '—'}</span><small>{patient.email || 'E-mail não informado'}</small></td><td>{patient.gender || 'Não informado'}</td>
              <td><div className="patient-table-tags">{patient.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}{patient.tags.length > 2 && <span>+{patient.tags.length - 2}</span>}{patient.tags.length === 0 && <small>Sem tags</small>}</div></td>
              <td><span className={`patient-status patient-status-${patient.status.toLowerCase()}`}>{patient.status}</span></td><td>{patient.lastModified || '—'}</td><td><button type="button" className="patient-open-button" onClick={() => openPatient(patient.id)} aria-label={`Abrir ${patient.name}`}>Abrir</button></td>
            </tr>)}
          </tbody></table></div> : <div className="patient-master-empty"><span aria-hidden="true">⌕</span><strong>{patients.length === 0 ? 'Nenhum paciente cadastrado' : 'Nenhum paciente encontrado'}</strong><p>{patients.length === 0 ? 'Cadastre o primeiro paciente para começar.' : 'Altere os filtros ou limpe a pesquisa para ver outros resultados.'}</p>{patients.length === 0 ? <button type="button" onClick={startCreate}>Cadastrar paciente</button> : <button type="button" onClick={clearFilters}>Limpar filtros</button>}</div>}
        </section>
      </MasterCrudLayout>
    </div>
  );
};

export default PatientManager;
