import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import WebDietCanvas from './WebDietCanvas';
import SiteBuilder from './SiteBuilder';
import type { MessageTemplate } from '../../types';

type MarketingSubTab = 'canvas' | 'mensagens' | 'modelos' | 'beneficios' | 'nutrilinks' | 'site';

const MarketingPanel: React.FC = () => {
  const { messageTemplates, setMessageTemplates } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState<MarketingSubTab>('canvas');

  // Modelos de Mensagens local editors
  const [isEditingModel, setIsEditingModel] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleEditTemplate = (tmpl: MessageTemplate) => {
    setIsEditingModel(tmpl.id);
    setEditTitle(tmpl.title);
    setEditContent(tmpl.content);
  };

  const handleSaveTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessageTemplates(prev => prev.map(t => {
      if (t.id === isEditingModel) {
        return { ...t, title: editTitle, content: editContent };
      }
      return t;
    }));
    setIsEditingModel(null);
    alert('Modelo de mensagem updated!');
  };

  return (
    <div className="main-content">
      <div className="patients-page-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px' }}>Painel de Marketing & Captação</h1>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button 
            className={`tab-btn ${activeSubTab === 'canvas' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('canvas')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            WebDiet Canvas
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'site' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('site')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Criador de Site & Leads
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'modelos' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('modelos')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Modelos de Mensagem
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'mensagens' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('mensagens')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Mensagens do Sistema
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'beneficios' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('beneficios')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Fidelização
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'nutrilinks' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('nutrilinks')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            NutriLinks
          </button>
        </div>
      </div>

      <div className="card">
        {/* WEBDiet CANVAS */}
        {activeSubTab === 'canvas' && <WebDietCanvas />}

        {/* SITE BUILDER & LEADS */}
        {activeSubTab === 'site' && <SiteBuilder />}

        {/* MODELOS DE MENSAGENS */}
        {activeSubTab === 'modelos' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Modelos de Mensagem / Templates</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Crie templates para agilizar suas respostas no chat do paciente. Use a chave de substituição <code>{"{nome}"}</code>.
            </p>

            {isEditingModel ? (
              <form onSubmit={handleSaveTemplate} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div className="form-group">
                  <label>Título do Modelo</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Corpo da Mensagem</label>
                  <textarea 
                    className="form-control" 
                    rows={4} 
                    value={editContent} 
                    onChange={(e) => setEditContent(e.target.value)} 
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn-teal">Salvar Alterações</button>
                  <button 
                    type="button" 
                    className="btn-teal" 
                    style={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => setIsEditingModel(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {messageTemplates.map(tmpl => (
                  <div key={tmpl.id} className="card" style={{ backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '14.5px', marginBottom: '6px' }}>{tmpl.title}</h3>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '14px' }}>"{tmpl.content}"</p>
                    </div>
                    <button 
                      className="btn-teal" 
                      style={{ padding: '6px 12px', fontSize: '12px', marginTop: 'auto' }}
                      onClick={() => handleEditTemplate(tmpl)}
                    >
                      Editar Modelo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MENSAGENS DO SISTEMA */}
        {activeSubTab === 'mensagens' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Mensagens e Automações do Sistema</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
              {[
                { title: 'Lembrete de consulta automático', desc: 'Dispara um lembrete no WhatsApp/E-mail do paciente 24h antes do horário agendado.', active: true },
                { title: 'Cobrança automatizada de inadimplência', desc: 'Dispara um lembrete amigável caso a fatura financeira permaneça pendente 3 dias após a consulta.', active: false },
                { title: 'Mensagem de aniversário', desc: 'Envia parabéns automático no dia de aniversário do paciente.', active: true }
              ].map((auto, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', padding: '14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div style={{ flex: 1, paddingRight: '16px' }}>
                    <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>{auto.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{auto.desc}</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked={auto.active} onChange={() => alert('Automação alterada com sucesso!')} />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FIDELIZAÇÃO */}
        {activeSubTab === 'beneficios' && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🎁</span>
            <h2 style={{ fontSize: '16px', marginBottom: '6px' }}>Programas de Benefícios para Pacientes</h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '320px', margin: '0 auto 16px auto' }}>
              Ofereça descontos em farmácias de manipulação ou marcas parceiras de alimentos saudáveis para pacientes assíduos.
            </p>
            <button className="btn-teal" style={{ width: 'auto' }} onClick={() => alert('Parcerias de fidelização atualizadas!')}>
              Atualizar Parceiros de Desconto
            </button>
          </div>
        )}

        {/* NUTRILINKS */}
        {activeSubTab === 'nutrilinks' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>NutriLinks - Página de Links (Bio)</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Crie uma página de links personalizada para colocar na bio do seu Instagram ou enviar por WhatsApp.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="card" style={{ backgroundColor: 'rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label>Link Personalizado</label>
                  <input type="text" className="form-control" defaultValue="webfit.com/dra.marinasilva" disabled />
                </div>
                <div className="form-group">
                  <label>Link do WhatsApp</label>
                  <input type="text" className="form-control" defaultValue="wa.me/5511999999999" />
                </div>
                <button className="btn-teal" onClick={() => alert('Link copiado para a área de transferência!')}>
                  Copiar NutriLink Principal
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '220px', border: '8px solid #1e293b', borderRadius: '24px', height: '360px', padding: '16px', backgroundColor: '#090e15', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid var(--primary-teal)' }}>
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>Dra. Marina Silva</span>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    {['Agende sua Consulta', 'Meus E-books de Receita', 'Dicas no Instagram'].map((linkText, idx) => (
                      <div key={idx} style={{ width: '100%', backgroundColor: 'var(--primary-teal)', color: 'white', fontSize: '9.5px', padding: '8px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer' }}>
                        {linkText}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingPanel;
