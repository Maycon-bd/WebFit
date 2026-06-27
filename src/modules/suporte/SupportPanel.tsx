import React, { useState } from 'react';

interface Faq {
  q: string;
  a: string;
}

const SupportPanel: React.FC = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [, setIsSubmitted] = useState(false);

  const faqs: Faq[] = [
    { q: 'Como convido meu paciente para o aplicativo?', a: 'Ao cadastrar o paciente, ele receberá um e-mail de convite com as credenciais. Certifique-se de preencher o celular e e-mail dele corretos na ficha.' },
    { q: 'Como ativo o plano WebDiet Black?', a: 'Você pode clicar no banner dourado no topo do seu painel a qualquer momento para alternar sua assinatura para o plano Black e liberar recursos exclusivos.' },
    { q: 'É seguro armazenar dados dos pacientes aqui?', a: 'Sim. Seus dados estão em conformidade com as diretrizes de privacidade de dados médicos (LGPD), sendo armazenados com criptografia ponta a ponta.' }
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;
    setIsSubmitted(true);
    setTimeout(() => {
      alert('Sua solicitação de suporte foi registrada! Nossa equipe entrará em contato em até 2 horas por e-mail.');
      setTicketSubject('');
      setTicketDescription('');
      setIsSubmitted(false);
    }, 100);
  };

  return (
    <div className="main-content">
      <div className="patients-page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px' }}>Suporte & Central de Ajuda</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        {/* Helpdesk ticket form */}
        <div className="card">
          <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Abrir Chamado Técnico</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Assunto / Tópico</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Dúvida sobre integrações com Smartwatch" 
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Descrição do Problema / Dúvida</label>
              <textarea 
                className="form-control" 
                rows={4} 
                placeholder="Descreva detalhadamente o que precisa de suporte..." 
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-teal">
              Enviar Solicitação
            </button>
          </form>
        </div>

        {/* FAQs list */}
        <div className="card">
          <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Perguntas Frequentes (FAQs)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '13.5px', color: 'var(--primary-teal)', marginBottom: '6px' }}>{faq.q}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPanel;
