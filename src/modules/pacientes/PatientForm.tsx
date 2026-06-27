import React, { useState, useEffect } from 'react';
import type { Patient } from '../../types';

interface PatientFormProps {
  patient: Patient | null;
  onSave: (patientData: Partial<Patient> & { name: string }) => void;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Feminino');
  const [birthDate, setBirthDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (patient) {
      setName(patient.name || '');
      setNickname(patient.nickname || '');
      setCpf(patient.cpf || '');
      setEmail(patient.email || '');
      setPhone(patient.phone || '');
      setGender(patient.gender || 'Feminino');
      setBirthDate(patient.birthDate || '');
      setTagsInput(patient.tags ? patient.tags.join(', ') : '');
      setNotes(patient.notes || '');
    }
  }, [patient]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim() === '') {
      alert('O nome do paciente é obrigatório!');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    const patientData = {
      id: patient ? patient.id : undefined,
      name,
      nickname: nickname || name.split(' ')[0],
      cpf,
      email,
      phone,
      gender,
      birthDate,
      tags,
      notes
    };

    onSave(patientData);
  };

  return (
    <div className="card" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>
        {patient ? 'Editar Ficha do Paciente' : 'Cadastrar Novo Paciente'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome Completo *</label>
          <input 
            type="text" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Ex: João da Silva Santos"
            required
          />
        </div>

        <div className="grid-2col" style={{ gap: '16px', marginBottom: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Apelido / Nome Social</label>
            <input 
              type="text" 
              className="form-control" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
              placeholder="Ex: Joãozinho"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Gênero</label>
            <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        <div className="grid-2col" style={{ gap: '16px', marginBottom: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>CPF</label>
            <input 
              type="text" 
              className="form-control" 
              value={cpf} 
              onChange={(e) => setCpf(e.target.value)} 
              placeholder="000.000.000-00"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Data de Nascimento</label>
            <input 
              type="date" 
              className="form-control" 
              value={birthDate} 
              onChange={(e) => setBirthDate(e.target.value)} 
            />
          </div>
        </div>

        <div className="grid-2col" style={{ gap: '16px', marginBottom: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>E-mail</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="email@exemplo.com"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Celular / WhatsApp</label>
            <input 
              type="text" 
              className="form-control" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tags de Agrupamento (separadas por vírgula)</label>
          <input 
            type="text" 
            className="form-control" 
            value={tagsInput} 
            onChange={(e) => setTagsInput(e.target.value)} 
            placeholder="Ex: Gestante, Atleta, Diabetes, LowCarb"
          />
        </div>

        <div className="form-group">
          <label>Anamnese / Histórico Clínico / Observações</label>
          <textarea 
            className="form-control" 
            rows={5}
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Histórico familiar, alergias, intolerâncias, exames alterados, suplementos em uso, rotina diária..."
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn-teal">
            Salvar Dados
          </button>
          <button 
            type="button" 
            className="btn-teal" 
            style={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
