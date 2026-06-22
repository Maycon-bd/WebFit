import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const FoodDiary = () => {
  const { notifications, patients, sendChatMessage } = useContext(AppContext);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [comments, setComments] = useState({});

  const handleSendComment = (postId, text) => {
    if (!text.trim()) return;
    setComments(prev => ({
      ...prev,
      [postId]: text
    }));

    // Find patient for this post
    const patient = patients.find(p => p.id === selectedPatientId);
    if (patient) {
      sendChatMessage(selectedPatientId, `Feedback sobre o Diário Alimentar: "${text}"`, 'doctor');
    }

    alert('Comentário enviado e integrado ao chat do paciente com sucesso!');
  };

  const patientPosts = notifications.filter(n => n.patientId === selectedPatientId);
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="main-content">
      <div className="patients-page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px' }}>Diário Alimentar</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Selecionar Paciente:</label>
          <select 
            className="form-control" 
            style={{ width: '220px', padding: '6px 12px', height: '34px' }}
            value={selectedPatientId} 
            onChange={(e) => setSelectedPatientId(e.target.value)}
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        {selectedPatient && (
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px' }}>Linha do Tempo - {selectedPatient.name}</h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Acompanhe as refeições registradas por foto e dê feedbacks para manter o engajamento.
            </p>
          </div>
        )}

        {patientPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>🍽️</span>
            Nenhuma foto registrada no diário alimentar deste paciente.
            <div style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-muted)' }}>
              (Use o simulador "20" na barra superior para disparar o upload de uma refeição aleatória de teste).
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {patientPosts.map(post => (
              <div 
                key={post.id} 
                className="card" 
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.15)', 
                  border: '1px solid rgba(255,255,255,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '16px'
                }}
              >
                <div style={{ height: '200px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <img 
                    src={post.mealPhoto} 
                    alt={post.mealName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>
                    Postado em {post.timestamp}
                  </span>
                  <h3 style={{ fontSize: '15px', margin: '4px 0 8px 0' }}>{post.mealName}</h3>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', marginTop: 'auto' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Feedback do Nutricionista
                  </label>
                  {comments[post.id] ? (
                    <div style={{ fontSize: '13px', backgroundColor: 'var(--bg-card-hover)', padding: '8px 12px', borderRadius: '4px', borderLeft: '3px solid var(--primary-teal)' }}>
                      {comments[post.id]}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input 
                        type="text" 
                        id={`input-${post.id}`}
                        className="form-control" 
                        placeholder="Comentar prato..."
                        style={{ padding: '6px 12px' }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSendComment(post.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button 
                        className="btn-teal" 
                        style={{ width: 'auto', padding: '0 12px' }}
                        onClick={() => {
                          const inputEl = document.getElementById(`input-${post.id}`);
                          if (inputEl && inputEl.value) {
                            handleSendComment(post.id, inputEl.value);
                            inputEl.value = '';
                          }
                        }}
                      >
                        Enviar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDiary;
