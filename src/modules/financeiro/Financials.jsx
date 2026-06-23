import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const Financials = () => {
  const { 
    financials, 
    addTransaction, 
    patients,
    triggerFinancialsCreate,
    setTriggerFinancialsCreate
  } = useContext(AppContext);
  
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [customClientName, setCustomClientName] = useState('');
  const [value, setValue] = useState('250.00');
  const [method, setMethod] = useState('PIX');
  const [isAdding, setIsAdding] = useState(false);

  // Sync state for quick action 'novo registro financeiro'
  React.useEffect(() => {
    if (triggerFinancialsCreate) {
      setIsAdding(true);
      setTriggerFinancialsCreate(false);
    }
  }, [triggerFinancialsCreate]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatientId && !customClientName) {
      alert('Selecione um paciente ou digite o nome de um cliente avulso!');
      return;
    }
    
    // Add transaction
    // If selectedPatientId is empty, it uses customClientName
    const patientName = selectedPatientId 
      ? patients.find(p => p.id === selectedPatientId)?.name 
      : customClientName;

    addTransaction(selectedPatientId || null, value, method);
    alert('Transação financeira registrada!');
    setCustomClientName('');
    setIsAdding(false);
  };

  // Calculations
  const totalRevenue = financials.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="main-content">
      <div className="patients-page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px' }}>Controle Financeiro</h1>
        <button className="btn-teal" style={{ width: 'auto' }} onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Ver Fluxo de Caixa' : '+ Registrar Entrada'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--color-success)' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: '500' }}>Receita Bruta Acumulada</span>
          <h2 style={{ fontSize: '28px', color: 'var(--color-success)', fontFamily: 'Outfit' }}>
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Valores recebidos a partir de atendimentos</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--primary-teal)' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: '500' }}>Atendimentos Registrados</span>
          <h2 style={{ fontSize: '28px', color: 'var(--text-teal)', fontFamily: 'Outfit' }}>
            {financials.length}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Consultas pagas no período</span>
        </div>
      </div>

      {isAdding ? (
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Registrar Recebimento</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Paciente WebFit</label>
              <select 
                className="form-control" 
                value={selectedPatientId} 
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  if (e.target.value) setCustomClientName('');
                }}
              >
                <option value="">Cliente Avulso (Não cadastrado em pacientes)</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {!selectedPatientId && (
              <div className="form-group">
                <label>Nome do Cliente Avulso</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Pedro Henrique de Oliveira" 
                  value={customClientName}
                  onChange={(e) => setCustomClientName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="grid-2col" style={{ gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Valor Cobrado (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  value={value} 
                  onChange={(e) => setValue(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Método de Pagamento</label>
                <select className="form-control" value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option value="PIX">PIX</option>
                  <option value="Cartão">Cartão de Crédito/Débito</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Transferência">TED / DOC</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button type="submit" className="btn-teal">Registrar Entrada</button>
              <button 
                type="button" 
                className="btn-teal" 
                style={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={() => setIsAdding(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card">
          <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Livro de Registro de Caixa (Entradas)</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Data</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Nome do Cliente</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Forma de Recebimento</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', textAlign: 'right' }}>Valor (R$)</th>
                </tr>
              </thead>
              <tbody>
                {financials.map(trans => (
                  <tr key={trans.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 8px' }}>{trans.date}</td>
                    <td style={{ padding: '12px 8px', fontWeight: '600' }}>{trans.patientName}</td>
                    <td style={{ padding: '12px 8px' }}>{trans.method}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ 
                        fontSize: '11.5px', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        backgroundColor: 'var(--color-success-bg)',
                        color: 'var(--color-success)',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        {trans.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>
                      R$ {trans.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financials;
