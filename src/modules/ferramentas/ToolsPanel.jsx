import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const ToolsPanel = () => {
  const { userProfile, toggleBlackStatus, appointments } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('videochamada'); // 'videochamada', 'movehealth', 'estatisticas', 'beneficios'

  // Video call state
  const [callActive, setCallActive] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (callActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // MoveHealth mock data
  const moveHealthData = [
    { date: '19/06', steps: 10430, kcal: 450, activity: 'Corrida na Esteira' },
    { date: '18/06', steps: 8520, kcal: 320, activity: 'Caminhada ao Ar Livre' },
    { date: '17/06', steps: 12100, kcal: 510, activity: 'Treino de Pernas (Musculação)' }
  ];

  return (
    <div className="main-content">
      <div className="patients-page-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px' }}>Ferramentas & Integrações</h1>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button 
            className={`tab-btn ${activeSubTab === 'videochamada' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('videochamada')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Videochamada (Teleconsulta)
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'movehealth' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('movehealth')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            MoveHealth (Black)
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'estatisticas' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('estatisticas')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Estatísticas do Consultório
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'beneficios' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('beneficios')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Benefícios para Você
          </button>
        </div>
      </div>

      <div className="card">
        {/* VIDEOCHAMADA */}
        {activeSubTab === 'videochamada' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Teleconsulta - Videochamada Integrada</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Realize suas consultas online direto pelo navegador com transmissão criptografada de alta definição.
            </p>

            {callActive ? (
              <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                <div style={{ position: 'relative', width: '100%', height: '360px', backgroundColor: '#090e15', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {/* Remote Patient Video Placeholder (Animated abstract SVG or pattern) */}
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', border: '2px solid var(--primary-teal)', display: 'flex', alignItems: 'center', justify: 'center', fontSize: '28px', marginBottom: '12px', fontWeight: 'bold' }}>
                      P
                    </div>
                    <span style={{ fontWeight: '600' }}>Paciente Conectado (Alaine)</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Transmissão Ativa • HD</span>
                  </div>

                  {/* Local Doctor Video Thumbnail (Bottom Right overlay) */}
                  <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '110px', height: '140px', borderRadius: '6px', border: '1.5px solid var(--accent-gold)', overflow: 'hidden', backgroundColor: 'var(--bg-navbar)' }}>
                    <img 
                      src={userProfile.avatar} 
                      alt="Médico" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>

                  {/* Timer Display overlay */}
                  <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                    REC • {formatTimer(timer)}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
                  <button 
                    className="btn-teal" 
                    style={{ width: 'auto', backgroundColor: 'var(--color-danger)' }}
                    onClick={() => setCallActive(false)}
                  >
                    Encerrar Chamada
                  </button>
                  <button 
                    className="btn-teal" 
                    style={{ width: 'auto', backgroundColor: 'var(--bg-card-hover)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => alert('Compartilhamento de tela ativado!')}
                  >
                    Compartilhar Tela
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '14px' }}>📹</span>
                <button className="btn-teal" style={{ width: 'auto' }} onClick={() => setCallActive(true)}>
                  Iniciar Teleconsulta de Teste
                </button>
              </div>
            )}
          </div>
        )}

        {/* MOVEHEALTH */}
        {activeSubTab === 'movehealth' && (
          <div>
            {!userProfile.isBlack ? (
              <div className="black-lock-screen">
                <span style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</span>
                <div className="lock-title">MoveHealth - Integração de Exercício Black</div>
                <p className="lock-desc">
                  Monitore em tempo real os passos, calorias queimadas e atividades físicas registradas nos smartwatches 
                  e celulares dos seus pacientes! Upgrade opcional para o plano **WebDiet Black**.
                </p>
                <button className="btn-teal" style={{ width: 'auto' }} onClick={toggleBlackStatus}>
                  Desbloquear MoveHealth (Black)
                </button>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '16px', marginBottom: '8px' }}>MoveHealth - Integração Fitness (Black)</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Exibição de logs agregados de atividades físicas recebidos via Apple Health / Google Fit.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {moveHealthData.map((day, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', padding: '14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
                      <div>
                        <strong>{day.date} - {day.activity}</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Gasto Estimado: {day.kcal} Kcal • Total de Passos: {day.steps}
                        </span>
                      </div>
                      <span style={{ fontSize: '12.5px', color: 'var(--primary-teal)', fontWeight: 'bold' }}>Sincronizado ✓</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ESTATÍSTICAS */}
        {activeSubTab === 'estatisticas' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Estatísticas Gerais do Consultório</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="card" style={{ backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fidelização Média</span>
                <h3 style={{ fontSize: '24px', margin: '4px 0', fontFamily: 'Outfit' }}>92%</h3>
                <span style={{ fontSize: '10.5px', color: 'var(--color-success)' }}>Retorno frequente de pacientes</span>
              </div>
              <div className="card" style={{ backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Consultas Realizadas</span>
                <h3 style={{ fontSize: '24px', margin: '4px 0', fontFamily: 'Outfit' }}>{appointments.length}</h3>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Histórico completo de atendimentos</span>
              </div>
            </div>
          </div>
        )}

        {/* BENEFÍCIOS PARA VOCÊ */}
        {activeSubTab === 'beneficios' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Seus Benefícios WebFit</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Como parceiro WebFit, você tem descontos e taxas exclusivas nas seguintes marcas:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {[
                { title: 'Essential Nutrition', promo: '15% OFF em suplementação e frete grátis nos pedidos do consultório.', code: 'WEBFIT15' },
                { title: 'NutriModa Jalecos', promo: '20% OFF em jalecos personalizados e vestuários de consultório.', code: 'JALECOFIT20' }
              ].map((promo, idx) => (
                <div key={idx} className="card" style={{ backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px' }}>
                  <h3 style={{ fontSize: '14.5px', color: 'var(--primary-teal)', marginBottom: '6px' }}>{promo.title}</h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '14px' }}>{promo.promo}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card-hover)', padding: '6px 12px', borderRadius: '4px', border: '1.5px dashed var(--primary-teal-border)' }}>
                    <code style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--text-primary)' }}>{promo.code}</code>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                      onClick={() => alert('Código promocional copiado!')}
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsPanel;
