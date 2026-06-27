import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import type { SiteSettings } from '../../types';

interface Lead {
  name: string;
  email: string;
  date: string;
}

const SiteBuilder: React.FC = () => {
  const { siteSettings, setSiteSettings } = useContext(AppContext);
  const [testLeadName, setTestLeadName] = useState('');
  const [testLeadEmail, setTestLeadEmail] = useState('');
  const [leads, setLeads] = useState<Lead[]>([
    { name: 'Marcos de Almeida', email: 'marcos.almeida@email.com', date: '19/06/2026' },
    { name: 'Priscila Mendes', email: 'priscila.mendes@email.com', date: '18/06/2026' }
  ]);

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setSiteSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSimulateVisitor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!testLeadName || !testLeadEmail) {
      alert('Preencha os campos para simular!');
      return;
    }

    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    
    const newLead: Lead = { name: testLeadName, email: testLeadEmail, date: dateStr };
    setLeads(prev => [newLead, ...prev]);
    
    alert(`[Simulação] Visitante "${testLeadName}" enviou contato no seu site! Lead inserido em 'Mailing captado'.`);
    setTestLeadName('');
    setTestLeadEmail('');
  };

  const getThemeColor = () => {
    if (siteSettings.theme === 'gold') return 'var(--accent-gold)';
    if (siteSettings.theme === 'purple') return 'var(--purple-glow)';
    return 'var(--primary-teal)';
  };

  return (
    <div>
      <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Criador de Site Profissional (Landing Page)</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Side: Editor Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Conteúdo do Site</h3>
            <div className="form-group">
              <label>Título / Nome Profissional</label>
              <input 
                type="text" 
                className="form-control" 
                value={siteSettings.title} 
                onChange={(e) => handleChange('title', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Biografia / Descrição de Serviços</label>
              <textarea 
                className="form-control" 
                rows={3}
                value={siteSettings.bio} 
                onChange={(e) => handleChange('bio', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Endereço de Atendimento</label>
              <input 
                type="text" 
                className="form-control" 
                value={siteSettings.address} 
                onChange={(e) => handleChange('address', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Telefone Comercial</label>
              <input 
                type="text" 
                className="form-control" 
                value={siteSettings.phone} 
                onChange={(e) => handleChange('phone', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Tema Visual</label>
              <select 
                className="form-control" 
                value={siteSettings.theme} 
                onChange={(e) => handleChange('theme', e.target.value)}
              >
                <option value="teal">Verde Teal (Padrão)</option>
                <option value="gold">Dourado Black</option>
                <option value="purple">Roxo Moderno</option>
              </select>
            </div>
          </div>

          {/* Visitor Simulator */}
          <div className="card" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Simular Contato de Lead no Site</h3>
            <form onSubmit={handleSimulateVisitor} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Nome do Visitante</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Clara de Souza" 
                  value={testLeadName}
                  onChange={(e) => setTestLeadName(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>E-mail do Visitante</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="clara@email.com" 
                  value={testLeadEmail}
                  onChange={(e) => setTestLeadEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-teal" style={{ width: 'auto', alignSelf: 'flex-start', marginTop: '8px' }}>
                Simular Envio
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Live preview and Mailing captured */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Landing Page Preview */}
          <div className="card" style={{ border: '2px dashed rgba(255,255,255,0.1)', padding: '16px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Visualização Online (Preview)</span>
            <div style={{ backgroundColor: 'white', color: '#1e293b', borderRadius: '6px', overflow: 'hidden', fontFamily: 'sans-serif' }}>
              {/* Header */}
              <div style={{ backgroundColor: getThemeColor(), color: 'white', padding: '16px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>{siteSettings.title}</h4>
              </div>
              {/* Body */}
              <div style={{ padding: '16px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ lineHeight: '1.4', fontStyle: 'italic', textAlign: 'center' }}>"{siteSettings.bio}"</p>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <div style={{ marginBottom: '4px' }}>📍 <strong>Endereço:</strong> {siteSettings.address}</div>
                  <div>📞 <strong>Contato:</strong> {siteSettings.phone}</div>
                </div>
                {/* Form placeholder */}
                <div style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '11px', textAlign: 'center' }}>Agende uma pré-avaliação</div>
                  <div style={{ height: '24px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '3px', marginBottom: '6px' }}></div>
                  <div style={{ height: '24px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '3px', marginBottom: '8px' }}></div>
                  <div style={{ height: '24px', backgroundColor: getThemeColor(), borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '10px' }}>
                    ENVIAR INTERESSE
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mailing Captured list */}
          <div className="card">
            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Mailing captado (Leads Recentes)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {leads.map((lead, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.15)', 
                    padding: '8px 12px', 
                    borderRadius: '4px',
                    fontSize: '12px' 
                  }}
                >
                  <div>
                    <strong>{lead.name}</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)' }}>{lead.email}</span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{lead.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteBuilder;
