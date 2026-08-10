import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';

const ClinicSetupScreen: React.FC = () => {
  const { createClinic, error, refresh } = useWorkspace();
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(error);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const result = await createClinic(name);
    setMessage(result);
    setSubmitting(false);
  };

  return (
    <main className="workspace-setup">
      <div className="workspace-setup-card">
        <span className="brand-mark">W</span>
        <span className="eyebrow">Primeiro acesso</span>
        <h1>Vamos criar seu espaço de cuidado.</h1>
        <p>Dê um nome ao consultório. Depois você poderá convidar profissionais e personalizar tudo.</p>
        {error ? (
          <div className="auth-message" role="alert">{error}<button type="button" onClick={() => void refresh()}>Tentar novamente</button></div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Nome do consultório<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Clínica Horizonte" minLength={2} required /></label>
            {message && <div className="auth-message" role="alert">{message}</div>}
            <button className="auth-submit" disabled={submitting}>{submitting ? 'Criando…' : 'Criar meu espaço'}</button>
          </form>
        )}
      </div>
    </main>
  );
};

export default ClinicSetupScreen;
