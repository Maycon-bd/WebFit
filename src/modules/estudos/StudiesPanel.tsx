import React from 'react';

interface Lamina {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  tags: string[];
}

const laminas: Lamina[] = [
  {
    id: 'l1',
    emoji: '🥗',
    title: 'Comparativo de Porções e Equivalências',
    desc: 'Lâmina visual ilustrando substitutos saudáveis de carboidratos complexos. Ideal para entregar ao paciente na consulta.',
    tags: ['Educação alimentar', 'Porções']
  },
  {
    id: 'l2',
    emoji: '🏛️',
    title: 'Pirâmide Alimentar Reestruturada',
    desc: 'Material explicativo de porções diárias baseado no Guia Alimentar da População Brasileira (2014).',
    tags: ['Guia alimentar', 'GAPB']
  },
  {
    id: 'l3',
    emoji: '💊',
    title: 'Suplementos Esportivos — Base de Evidência',
    desc: 'Lâmina de apoio sobre uso seguro e embasado de Creatina, Cafeína e Whey Protein.',
    tags: ['Suplementação', 'Esporte']
  },
  {
    id: 'l4',
    emoji: '🥛',
    title: 'Medidas Caseiras e Equivalências Culinárias',
    desc: 'Tabela de referência com colheres, xícaras, copos e porções equivalentes para facilitar o preenchimento do cardápio.',
    tags: ['Medidas', 'Cardápio']
  },
  {
    id: 'l5',
    emoji: '🩺',
    title: 'Classificação do IMC e Risco Metabólico',
    desc: 'Lâmina informativa com a tabela de IMC da OMS e interpretação clínica do risco cardiovascular.',
    tags: ['IMC', 'Saúde']
  },
  {
    id: 'l6',
    emoji: '🌾',
    title: 'Fontes de Fibras e Prebióticos',
    desc: 'Material visual com alimentos ricos em fibras solúveis e insolúveis, e sua relação com a saúde intestinal.',
    tags: ['Fibras', 'Microbiota']
  }
];

const StudiesPanel: React.FC = () => {
  return (
    <div className="main-content">
      <div className="patients-page-header" style={{ marginBottom: '8px' }}>
        <h1 style={{ fontSize: '20px' }}>Estudos — Lâminas Informativas</h1>
      </div>

      {/* Nota informativa */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 18px',
        backgroundColor: 'rgba(var(--primary-teal-rgb, 32, 178, 170), 0.07)',
        border: '1px solid rgba(var(--primary-teal-rgb, 32, 178, 170), 0.18)',
        borderRadius: '8px',
        marginBottom: '28px',
        fontSize: '13px',
        color: 'var(--text-secondary)'
      }}>
        <span style={{ fontSize: '18px' }}>📌</span>
        <span>
          <strong style={{ color: 'var(--text-primary)' }}>Conteúdo fixo</strong> — estas lâminas são materiais de apoio para uso em consulta. Não requerem atualizações frequentes.
        </span>
      </div>

      <div className="card">
        <div className="widget-header" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px' }}>
            📋 Lâminas Didáticas de Apoio ao Atendimento
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {laminas.length} lâminas disponíveis
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '18px'
        }}>
          {laminas.map(lam => (
            <div
              key={lam.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '20px',
                backgroundColor: 'rgba(0,0,0,0.18)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary-teal-border)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Ícone */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(var(--primary-teal-rgb, 32, 178, 170), 0.1)',
                border: '1px solid rgba(var(--primary-teal-rgb, 32, 178, 170), 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {lam.emoji}
              </div>

              {/* Conteúdo */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lam.title}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '12px' }}>
                  {lam.desc}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {lam.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '10.5px',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        backgroundColor: 'var(--primary-teal-light)',
                        color: 'var(--text-teal)',
                        border: '1px solid var(--primary-teal-border)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botão */}
              <button
                className="btn-teal"
                style={{ padding: '9px 14px', fontSize: '12.5px', marginTop: 'auto' }}
                onClick={() => alert(`Simulando download do arquivo PDF: "${lam.title}"`)}
              >
                ⬇ Baixar Lâmina PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudiesPanel;
