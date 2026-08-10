import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './auth.css';

const AuthScreen: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const error = mode === 'login'
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password, displayName.trim());
    setSubmitting(false);
    setMessage(error ?? (mode === 'signup' ? 'Conta criada. Confirme seu e-mail para entrar.' : null));
  };

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-label="Apresentação WebFit">
        <div className="auth-brand"><span className="brand-mark">W</span> WebFit</div>
        <div className="auth-story-copy">
          <span className="eyebrow">Cuidado que vira progresso</span>
          <h1>Uma rotina clínica mais humana, clara e conectada.</h1>
          <p>Organize o acompanhamento nutricional sem perder o que importa: contexto, vínculo e evolução.</p>
        </div>
        <div className="auth-proof">
          <span>Prontuário protegido</span><span>Agenda integrada</span><span>Visão longitudinal</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <span className="eyebrow">Área profissional</span>
          <h2>{mode === 'login' ? 'Que bom ter você de volta' : 'Crie seu espaço clínico'}</h2>
          <p>{mode === 'login' ? 'Entre para continuar seus acompanhamentos.' : 'Comece com sua conta profissional. A clínica será configurada no próximo passo.'}</p>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label>Nome profissional<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" required /></label>
            )}
            <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
            <label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} required /></label>
            {message && <div className="auth-message" role="status">{message}</div>}
            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Aguarde…' : mode === 'login' ? 'Entrar no WebFit' : 'Criar minha conta'}
            </button>
          </form>

          <button className="auth-switch" type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(null); }}>
            {mode === 'login' ? 'Ainda não tem uma conta? Criar agora' : 'Já possui uma conta? Entrar'}
          </button>
        </div>
      </section>
    </main>
  );
};

export default AuthScreen;
