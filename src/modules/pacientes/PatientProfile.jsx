import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const PatientProfile = ({ patient, onEdit, onBack }) => {
  const { 
    userProfile, 
    toggleBlackStatus, 
    addPrescription, 
    addAppointment,
    appointments,
    chats,
    sendChatMessage,
    notifications,
    addTransaction
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('anamnese'); // 'anamnese', 'prescrever', 'preconsulta', 'metas', 'diario', 'impressos', 'retorno'
  
  // Tab states
  const [prescriptionType, setPrescriptionType] = useState('Cardápio Semanal');
  const [selectedTemplate, setSelectedTemplate] = useState('mt1');
  const [preconsultaSent, setPreconsultaSent] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  const [patientGoals, setPatientGoals] = useState([
    { id: 'g1', text: 'Consumir 2.5L de água por dia', done: false },
    { id: 'g2', text: 'Treinar musculação 4x na semana', done: true },
    { id: 'g3', text: 'Evitar alimentos ultraprocessados', done: false }
  ]);
  const [mealComments, setMealComments] = useState({});
  const [printedDocType, setPrintedDocType] = useState('Receituário de Suplementação');
  const [returnDate, setReturnDate] = useState('2026-07-15');
  const [returnTime, setReturnTime] = useState('14:00');
  const [returnType, setReturnType] = useState('Presencial');

  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return 'Não informada';
    const birthDate = new Date(birthDateStr);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + ' anos';
  };

  const handleEmitPrescription = (e) => {
    e.preventDefault();
    addPrescription(prescriptionType, patient.id);
    alert(`Prescrição (${prescriptionType}) emitida com sucesso para ${patient.name}! Ela agora aparece no bloco 'Prescrições recentes'.`);
  };

  const handleSendPreconsulta = (e) => {
    e.preventDefault();
    setPreconsultaSent(true);
    setTimeout(() => {
      alert(`Formulário de Pré-consulta enviado por e-mail e WhatsApp para ${patient.name}!`);
    }, 100);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newGoalText.trim() === '') return;
    setPatientGoals(prev => [
      ...prev,
      { id: Date.now().toString(), text: newGoalText, done: false }
    ]);
    setNewGoalText('');
  };

  const toggleGoal = (goalId) => {
    setPatientGoals(prev => prev.map(g => {
      if (g.id === goalId) return { ...g, done: !g.done };
      return g;
    }));
  };

  const handleCommentMeal = (notiId, text) => {
    setMealComments(prev => ({
      ...prev,
      [notiId]: text
    }));
    // Simulate sending chat message as feedback
    sendChatMessage(patient.id, `Comentário sobre sua refeição: "${text}"`, 'doctor');
    alert('Seu feedback foi registrado e enviado ao chat do paciente!');
  };

  const handleScheduleReturn = (e) => {
    e.preventDefault();
    addAppointment({
      patientId: patient.id,
      date: returnDate,
      time: returnTime,
      type: returnType
    });
    // Add transaction simulation too
    addTransaction(patient.id, 250, 'PIX');
    alert(`Retorno agendado com sucesso para o dia ${returnDate} às ${returnTime} (${returnType}). Faturamento financeiro gerado!`);
  };

  // Filter notifications (diario photos) belonging to this patient
  const patientDiarioPosts = notifications.filter(n => n.patientId === patient.id);

  // Return appointments list for this patient
  const patientAppointments = appointments.filter(ap => ap.patientId === patient.id);

  return (
    <div className="patients-container">
      {/* Profile Header */}
      <div className="patient-profile-header">
        <div className="profile-identity">
          <div className="profile-large-avatar">
            <img 
              src={patient.gender === 'Masculino' 
                ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' 
                : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
              } 
              alt="Avatar do Paciente" 
            />
          </div>
          <div className="profile-name-area">
            <h1>{patient.name}</h1>
            <div className="tag-list">
              {patient.tags && patient.tags.map((tag, idx) => (
                <span key={idx} className="tag-badge">{tag}</span>
              ))}
              <span className={`tag-badge`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
                Status: {patient.status}
              </span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-teal" onClick={() => onEdit(patient)} style={{ width: 'auto' }}>
            Editar Ficha
          </button>
          <button 
            className="btn-teal" 
            style={{ width: 'auto', backgroundColor: 'var(--bg-card-hover)', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={onBack}
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Grid Layout: Sidebar & Tabs */}
      <div className="profile-body-grid">
        {/* Sidebar Info */}
        <div className="patient-info-sidebar">
          <div className="info-sidebar-block">
            <h3>Dados Pessoais</h3>
            <div className="info-item">
              <label>Nome Social / Apelido</label>
              <span>{patient.nickname || 'Nenhum'}</span>
            </div>
            <div className="info-item">
              <label>CPF</label>
              <span>{patient.cpf || 'Não informado'}</span>
            </div>
            <div className="info-item">
              <label>Data de Nascimento</label>
              <span>{patient.birthDate ? patient.birthDate.split('-').reverse().join('/') : 'Não informada'}</span>
            </div>
            <div className="info-item">
              <label>Idade</label>
              <span>{calculateAge(patient.birthDate)}</span>
            </div>
            <div className="info-item">
              <label>Gênero</label>
              <span>{patient.gender}</span>
            </div>
          </div>

          <div className="info-sidebar-block">
            <h3>Contato</h3>
            <div className="info-item">
              <label>Celular / WhatsApp</label>
              <span>{patient.phone || 'Não informado'}</span>
            </div>
            <div className="info-item">
              <label>E-mail</label>
              <span>{patient.email || 'Não informado'}</span>
            </div>
          </div>
        </div>

        {/* Tab Area */}
        <div className="profile-content-area">
          {/* Tabs header */}
          <div className="tabs-menu">
            <button className={`tab-btn ${activeTab === 'anamnese' ? 'active' : ''}`} onClick={() => setActiveTab('anamnese')}>Anamnese</button>
            <button className={`tab-btn ${activeTab === 'prescrever' ? 'active' : ''}`} onClick={() => setActiveTab('prescrever')}>Cardápio</button>
            <button className={`tab-btn ${activeTab === 'preconsulta' ? 'active' : ''}`} onClick={() => setActiveTab('preconsulta')}>Pré-consulta</button>
            <button className={`tab-btn ${activeTab === 'metas' ? 'active' : ''}`} onClick={() => setActiveTab('metas')}>iMetas</button>
            <button className={`tab-btn ${activeTab === 'diario' ? 'active' : ''}`} onClick={() => setActiveTab('diario')}>Diário Alimentar</button>
            <button className={`tab-btn ${activeTab === 'impressos' ? 'active' : ''}`} onClick={() => setActiveTab('impressos')}>Impressos</button>
            <button className={`tab-btn ${activeTab === 'retorno' ? 'active' : ''}`} onClick={() => setActiveTab('retorno')}>Retorno</button>
          </div>

          {/* Tab contents */}
          <div className="tab-content">
            {/* ANAMNESE */}
            {activeTab === 'anamnese' && (
              <div>
                <h3 style={{ marginBottom: '12px' }}>Anamnese / Histórico Clínico</h3>
                <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                  {patient.notes || 'Nenhuma nota clínica cadastrada para este paciente. Clique em "Editar Ficha" acima para adicionar anamnese e observações clínicas relevantes.'}
                </p>
              </div>
            )}

            {/* PRESCREVER */}
            {activeTab === 'prescrever' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>Prescrever Plano Alimentar / Cardápio</h3>
                <form onSubmit={handleEmitPrescription} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                  <div className="form-group">
                    <label>Tipo de Prescrição</label>
                    <select 
                      className="form-control" 
                      value={prescriptionType} 
                      onChange={(e) => setPrescriptionType(e.target.value)}
                    >
                      <option value="Cardápio Semanal">Cardápio Semanal Padrão</option>
                      <option value="Plano de Emagrecimento Definição">Plano de Emagrecimento / Definição</option>
                      <option value="Protocolo Hipertrofia Limpa">Protocolo Hipertrofia Limpa</option>
                      <option value="Cardápio Low Carb Ajustado">Cardápio Low Carb Ajustado</option>
                      <option value="Planejamento Gestacional Fit">Planejamento Gestacional Fit</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Observações da Prescrição</label>
                    <textarea className="form-control" rows="3" placeholder="Restrições adicionais, horários de suplementos..."></textarea>
                  </div>
                  <button type="submit" className="btn-teal" style={{ width: 'auto', alignSelf: 'flex-start' }}>
                    Emitir Cardápio
                  </button>
                </form>
              </div>
            )}

            {/* PRECONSULTA */}
            {activeTab === 'preconsulta' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>Formulário de Pré-consulta</h3>
                <form onSubmit={handleSendPreconsulta} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', marginBottom: '32px' }}>
                  <div className="form-group">
                    <label>Selecionar Modelo de Questionário</label>
                    <select 
                      className="form-control" 
                      value={selectedTemplate} 
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                      <option value="mt3">Instruções de Pré-consulta Geral</option>
                      <option value="mt1">Boas-vindas ao consultório</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-teal" style={{ width: 'auto', alignSelf: 'flex-start' }}>
                    Enviar Formulário de Pré-consulta
                  </button>
                </form>

                {preconsultaSent && (
                  <div style={{ padding: '16px', backgroundColor: 'var(--primary-teal-light)', border: '1px solid var(--primary-teal-border)', borderRadius: '6px', marginBottom: '24px' }}>
                    <strong>✓ Enviado:</strong> Link de pré-consulta gerado e disparado. Aguardando respostas.
                  </div>
                )}

                <h3 style={{ marginBottom: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>Respostas Enviadas</h3>
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)', padding: '16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '600' }}>Questionário Clínico Geral</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Preenchido em 18/06/2026 - 15:40</span>
                  </div>
                  <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ fontSize: '13px' }}><strong>1. Qual o seu principal objetivo?</strong> Reeducação e perda de peso leve, melhorar sono.</li>
                    <li style={{ fontSize: '13px' }}><strong>2. Possui restrições ou alergias?</strong> Intolerância leve à lactose. Evita camarão.</li>
                    <li style={{ fontSize: '13px' }}><strong>3. Pratica atividades físicas?</strong> Caminhadas na esteira 3x por semana.</li>
                    <li style={{ fontSize: '13px' }}><strong>4. Qual o seu maior obstáculo alimentar?</strong> Vontade excessiva de doces à noite.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* METAS (BLACK SCREEN WITH UPGRADE ACTION) */}
            {activeTab === 'metas' && (
              <div>
                {!userProfile.isBlack ? (
                  <div className="black-lock-screen">
                    <span style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</span>
                    <div className="lock-title">iMetas - Recurso WebDiet Black</div>
                    <p className="lock-desc">
                      A definição e acompanhamento gráfico de metas para pacientes é exclusiva para assinantes do **WebDiet Black**. 
                      Eleve seus atendimentos com iMetas, MoveHealth e Inteligência Artificial!
                    </p>
                    <button className="btn-teal" style={{ width: 'auto' }} onClick={toggleBlackStatus}>
                      Experimentar WebDiet Black Gratuitamente
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ marginBottom: '12px' }}>iMetas do Paciente (Membro Black)</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                      Defina metas de hábitos e acompanhe a evolução do paciente nas consultas.
                    </p>

                    <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ex: Comer 3 porções de frutas por dia" 
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                      />
                      <button type="submit" className="btn-teal" style={{ width: 'auto' }}>Adicionar Meta</button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {patientGoals.map(goal => (
                        <div key={goal.id} className={`task-item ${goal.done ? 'done' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                          <div 
                            className={`task-checkbox ${goal.done ? 'checked' : ''}`}
                            onClick={() => toggleGoal(goal.id)}
                          >
                            {goal.done && '✓'}
                          </div>
                          <span className="task-text">{goal.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DIARIO ALIMENTAR */}
            {activeTab === 'diario' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>Diário Alimentar do Paciente</h3>
                {patientDiarioPosts.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    Este paciente ainda não enviou fotos no diário alimentar. 
                    (Dica: Use a notificação "20" no canto superior direito para simular o upload de fotos).
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {patientDiarioPosts.map(post => (
                      <div 
                        key={post.id} 
                        style={{ 
                          display: 'flex', 
                          gap: '16px', 
                          border: '1px solid rgba(255, 255, 255, 0.05)', 
                          padding: '16px', 
                          borderRadius: '8px',
                          backgroundColor: 'rgba(0,0,0,0.1)'
                        }}
                      >
                        <div style={{ width: '120px', height: '120px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                          <img src={post.mealPhoto} alt="Refeição" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Enviado em {post.timestamp}</span>
                            <h4 style={{ margin: '4px 0', fontSize: '15px' }}>{post.mealName}</h4>
                          </div>
                          
                          <div style={{ marginTop: '12px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Comentário / Feedback do Nutri</label>
                            {mealComments[post.id] ? (
                              <div style={{ fontSize: '13px', backgroundColor: 'var(--bg-card-hover)', padding: '8px 12px', borderRadius: '4px', borderLeft: '3px solid var(--primary-teal)' }}>
                                {mealComments[post.id]}
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="Escreva um feedback rápido..." 
                                  style={{ padding: '6px 12px' }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleCommentMeal(post.id, e.target.value);
                                      e.target.value = '';
                                    }
                                  }}
                                />
                                <button 
                                  className="btn-teal" 
                                  style={{ width: 'auto', padding: '0 12px' }}
                                  onClick={(e) => {
                                    const input = e.target.previousSibling;
                                    if (input.value) {
                                      handleCommentMeal(post.id, input.value);
                                      input.value = '';
                                    }
                                  }}
                                >
                                  Enviar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* IMPRESSOS */}
            {activeTab === 'impressos' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>Modelos de Impressos e Documentos</h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert(`[Impressos] PDF para "${printedDocType}" gerado com sucesso! Iniciando download simulado.`);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}
                >
                  <div className="form-group">
                    <label>Tipo de Documento</label>
                    <select 
                      className="form-control" 
                      value={printedDocType} 
                      onChange={(e) => setPrintedDocType(e.target.value)}
                    >
                      <option value="Receituário de Suplementação">Receituário de Suplementação</option>
                      <option value="Atestado de Acompanhamento Nutricional">Atestado de Acompanhamento Nutricional</option>
                      <option value="Laudo Clínico para Cirurgia">Laudo Clínico para Cirurgia (Ex: Bariátrica)</option>
                      <option value="Termo de Consentimento Livre e Esclarecido">Termo de Consentimento Livre e Esclarecido</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-teal" style={{ width: 'auto', alignSelf: 'flex-start' }}>
                    Gerar PDF / Imprimir
                  </button>
                </form>
              </div>
            )}

            {/* RETORNO */}
            {activeTab === 'retorno' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>Agendar Consulta de Retorno</h3>
                <form onSubmit={handleScheduleReturn} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                  <div className="form-group">
                    <label>Data da Consulta</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={returnDate} 
                      onChange={(e) => setReturnDate(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Horário</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      value={returnTime} 
                      onChange={(e) => setReturnTime(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Modalidade</label>
                    <select 
                      className="form-control" 
                      value={returnType} 
                      onChange={(e) => setReturnType(e.target.value)}
                    >
                      <option value="Presencial">Presencial (Consultório Principal)</option>
                      <option value="Online">Online (Videochamada Integrada)</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-teal" style={{ width: 'auto', alignSelf: 'flex-start' }}>
                    Confirmar Agendamento e Gerar Fatura
                  </button>
                </form>

                <h3 style={{ marginTop: '24px', marginBottom: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>Histórico de Consultas</h3>
                {patientAppointments.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Nenhum atendimento registrado anteriormente.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {patientAppointments.map(ap => (
                      <div 
                        key={ap.id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          backgroundColor: 'rgba(0,0,0,0.1)', 
                          padding: '10px 14px', 
                          borderRadius: '6px', 
                          border: '1px solid rgba(255,255,255,0.02)',
                          fontSize: '13px'
                        }}
                      >
                        <div>
                          <strong>{ap.date.split('-').reverse().join('/')}</strong> às {ap.time} - {ap.type}
                        </div>
                        <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>{ap.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
