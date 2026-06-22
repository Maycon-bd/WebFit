import React, { useState } from 'react';

const WebDietCanvas = () => {
  const [template, setTemplate] = useState('dica'); // 'dica', 'receita', 'agendamento'
  const [title, setTitle] = useState('Dica de Nutrição Saudável');
  const [subtitle, setSubtitle] = useState('Beba água logo ao acordar para ativar seu metabolismo!');
  const [bgColor, setBgColor] = useState('#0da19c');
  const [textColor, setTextColor] = useState('#ffffff');

  const handleExport = () => {
    alert(`[Canvas] Arte "${title}" exportada com sucesso! Simulando o download do arquivo de imagem PNG.`);
  };

  return (
    <div>
      <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>WebDiet Canvas - Criador de Conteúdo Visual</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        {/* Editor Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>Template Base</label>
            <select 
              className="form-control" 
              value={template} 
              onChange={(e) => {
                setTemplate(e.target.value);
                if (e.target.value === 'dica') {
                  setTitle('Dica de Nutrição Saudável');
                  setSubtitle('Beba água logo ao acordar para ativar seu metabolismo!');
                  setBgColor('#0da19c');
                } else if (e.target.value === 'receita') {
                  setTitle('Receita Prática Fit');
                  setSubtitle('Panqueca de aveia com mel e morangos frescos.');
                  setBgColor('#c29547');
                } else {
                  setTitle('Agenda de Consultas Aberta');
                  setSubtitle('Garanta seu horário de retorno para este mês!');
                  setBgColor('#152232');
                }
              }}
            >
              <option value="dica">Dica de Saúde</option>
              <option value="receita">Receita Culínaria</option>
              <option value="agendamento">Agendamento de Consultas</option>
            </select>
          </div>

          <div className="form-group">
            <label>Título do Post</label>
            <input 
              type="text" 
              className="form-control" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Texto de Descrição</label>
            <textarea 
              className="form-control" 
              rows="3"
              value={subtitle} 
              onChange={(e) => setSubtitle(e.target.value)} 
            />
          </div>

          <div className="grid-2col" style={{ gap: '10px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Fundo</label>
              <input 
                type="color" 
                className="form-control" 
                style={{ padding: '2px', height: '36px', cursor: 'pointer' }}
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Texto</label>
              <input 
                type="color" 
                className="form-control" 
                style={{ padding: '2px', height: '36px', cursor: 'pointer' }}
                value={textColor} 
                onChange={(e) => setTextColor(e.target.value)} 
              />
            </div>
          </div>

          <button className="btn-teal" onClick={handleExport} style={{ marginTop: '10px' }}>
            Exportar Arte PNG
          </button>
        </div>

        {/* Live Canvas View */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090e15', borderRadius: '8px', padding: '20px', minHeight: '340px' }}>
          <div 
            style={{ 
              width: '300px', 
              height: '300px', 
              backgroundColor: bgColor, 
              color: textColor,
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background-color 0.3s ease'
            }}
          >
            {/* Watermark Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.85 }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'conic-gradient(#10b981, #f59e0b, #ef4444)' }}></div>
              <span style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'Outfit' }}>WebFit Arts</span>
            </div>

            <div style={{ margin: 'auto 0' }}>
              <h3 style={{ fontSize: '20px', fontFamily: 'Outfit', fontWeight: '800', marginBottom: '10px', lineHeight: '1.2' }}>{title}</h3>
              <p style={{ fontSize: '12px', opacity: 0.9, lineHeight: '1.4' }}>{subtitle}</p>
            </div>

            <div style={{ fontSize: '9px', opacity: 0.6, textAlign: 'right' }}>
              Dra. Marina Silva - Nutricionista
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebDietCanvas;
