import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const ChatWindow: React.FC = () => {
  const { patients, chats, sendChatMessage, messageTemplates } = useContext(AppContext);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [typedMessage, setTypedMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activePatient = patients.find(p => p.id === selectedPatientId);
  const thread = chats[selectedPatientId] || [];

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typedMessage.trim() === '') return;
    sendChatMessage(selectedPatientId, typedMessage, 'doctor');
    setTypedMessage('');
  };

  const handleApplyTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    if (!templateId) return;

    const template = messageTemplates.find(t => t.id === templateId);
    if (template && activePatient) {
      const parsed = template.content.replace('{nome}', activePatient.nickname || activePatient.name.split(' ')[0]);
      setTypedMessage(parsed);
    }
    e.target.value = '';
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', height: '520px', padding: 0, overflow: 'hidden' }}>
        {/* Left Side: Patients list */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>Mensagens</h3>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar chat..." 
              style={{ padding: '6px 10px', fontSize: '13px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {filteredPatients.map(p => {
              const active = p.id === selectedPatientId;
              const lastMsg = chats[p.id]?.slice(-1)[0]?.text || 'Nenhuma conversa iniciada';
              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  style={{ 
                    padding: '14px 16px', 
                    cursor: 'pointer', 
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    backgroundColor: active ? 'var(--bg-card-hover)' : '',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '13.5px', color: active ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{p.name.split(' ').slice(0, 2).join(' ')}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '4px' }}>
                    {lastMsg}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Message Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }}>
          {activePatient ? (
            <>
              {/* Thread Header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'var(--bg-navbar)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px' }}>{activePatient.name}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-teal)', display: 'block', marginTop: '2px' }}>Paciente Ativo • Online</span>
                </div>
              </div>

              {/* Thread Messages */}
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {thread.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    Inicie a conversa enviando uma mensagem de boas-vindas abaixo!
                  </div>
                ) : (
                  thread.map((msg, idx) => {
                    const isDoc = msg.sender === 'doctor';
                    return (
                      <div 
                        key={idx}
                        style={{ 
                          alignSelf: isDoc ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          backgroundColor: isDoc ? 'var(--primary-teal)' : 'var(--bg-card-hover)',
                          color: 'white',
                          padding: '10px 14px',
                          borderRadius: isDoc ? '12px 12px 0 12px' : '12px 12px 12px 0',
                          border: isDoc ? 'none' : '1px solid rgba(255,255,255,0.05)',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                        }}
                      >
                        <p style={{ fontSize: '13.5px', lineHeight: '1.4' }}>{msg.text}</p>
                        <span style={{ fontSize: '9px', opacity: 0.7, float: 'right', marginTop: '4px', marginLeft: '12px' }}>{msg.time.split(' - ')[1]}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Thread Input Footer */}
              <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'var(--bg-navbar)' }}>
                {/* Apply templates selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Usar Modelo:</label>
                  <select 
                    className="form-control" 
                    style={{ width: '200px', padding: '4px 8px', height: '28px', fontSize: '12px' }}
                    onChange={handleApplyTemplate}
                  >
                    <option value="">Escolha um modelo...</option>
                    {messageTemplates.map(tmpl => (
                      <option key={tmpl.id} value={tmpl.id}>{tmpl.title}</option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Digite sua mensagem para o paciente..." 
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                  />
                  <button type="submit" className="btn-teal" style={{ width: 'auto', padding: '0 20px' }}>
                    Enviar
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Selecione um paciente na lista para iniciar o atendimento via chat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
