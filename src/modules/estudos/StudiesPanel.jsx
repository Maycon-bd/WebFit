import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const StudiesPanel = () => {
  const { userProfile, toggleBlackStatus } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('laminas'); // 'laminas', 'cursos', 'cast', 'biblioteca', 'casos', 'pasta', 'ebooks', 'blog'
  
  // States
  const [searchArticle, setSearchArticle] = useState('');
  const [coursesProgress, setCoursesProgress] = useState({
    'c1': 45,
    'c2': 0,
    'c3': 80
  });

  const handleLessonComplete = (courseId) => {
    setCoursesProgress(prev => {
      const current = prev[courseId] || 0;
      const next = Math.min(current + 20, 100);
      return {
        ...prev,
        [courseId]: next
      };
    });
  };

  // Mock Cursos
  const courses = [
    { id: 'c1', title: 'Nutrição Esportiva e Periodização de Dieta', author: 'Dr. Roberto Cruz', lessons: 10, category: 'Clínica' },
    { id: 'c2', title: 'Gestão Financeira e Marketing para Consultório', author: 'Consultoria WebFit', lessons: 5, category: 'Gestão' },
    { id: 'c3', title: 'Fisiopatologia do Emagrecimento e Protocolos Práticos', author: 'Dra. Luiza Nogueira', lessons: 8, category: 'Clínica' }
  ];

  // Mock Lâminas
  const laminas = [
    { id: 'l1', title: 'Comparativo de Porções e Equivalências', desc: 'Lâmina visual ilustrando substitutos saudáveis de carboidratos complexos.' },
    { id: 'l2', title: 'Pirâmide Alimentar Reestruturada', desc: 'Material explicativo de porções diárias baseado no Guia Alimentar da População Brasileira.' },
    { id: 'l3', title: 'Suplementos Esportivos Base de Evidência', desc: 'Lâmina de apoio sobre o uso de Creatina, Cafeína e Whey Protein.' }
  ];

  // Mock Articles
  const scientificArticles = [
    { id: 'a1', title: 'Ketogenic Diet and Glycemic Control in Type 2 Diabetes', journal: 'Journal of Clinical Endocrinology (2025)', abstract: 'Revisão sistemática demonstrando o impacto de carboidratos reduzidos na regulação de HbA1c e redução de medicação hipoglicemiante.' },
    { id: 'a2', title: 'Protein Distribution and Muscle Protein Synthesis in Athletes', journal: 'Sports Medicine Review (2026)', abstract: 'Estudo clínico demonstrando que a distribuição fracionada de proteína (25-30g a cada 3h) maximiza hipertrofia muscular frente a porções únicas massivas.' },
    { id: 'a3', title: 'Gut Microbiota and Obesity: Pathophysiology and Diet Interventions', journal: 'Nature Reviews Nutrition (2024)', abstract: 'Investigação de como fibras solúveis e prebióticos alteram a microbiota intestinal e atuam no controle da saciedade.' }
  ];

  // Mock Casos Clínicos
  const casosClinicos = [
    { id: 'cc1', title: 'Caso Clínico 01 - Hipertrofia em Atleta Vegano', desc: 'Paciente do sexo masculino, 24 anos. Ajuste de aporte proteico utilizando leguminosas, proteínas vegetais isoladas e controle de ferro e B12.' },
    { id: 'cc2', title: 'Caso Clínico 02 - Resistência Insulínica e SOP', desc: 'Paciente do sexo feminino, 31 anos, diagnosticada com Síndrome dos Ovários Policísticos. Introdução de dieta de baixo índice glicêmico e inositol.' }
  ];

  // Filter articles
  const filteredArticles = scientificArticles.filter(art => 
    art.title.toLowerCase().includes(searchArticle.toLowerCase()) ||
    art.journal.toLowerCase().includes(searchArticle.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="patients-page-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px' }}>Estudos e Atualização Científica</h1>
        {/* Menu das SubAbas */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button 
            className={`tab-btn ${activeSubTab === 'laminas' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('laminas')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Lâminas
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'cursos' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('cursos')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Cursos Completos
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'cast' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('cast')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            WebDiet Cast
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'biblioteca' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('biblioteca')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Biblioteca Científica
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'casos' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('casos')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Casos Clínicos
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'pasta' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('pasta')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Pasta Compartilhada
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'ebooks' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('ebooks')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            E-books
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'blog' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('blog')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Blog
          </button>
        </div>
      </div>

      <div className="card">
        {/* LÂMINAS */}
        {activeSubTab === 'laminas' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Lâminas Didáticas de Apoio ao Atendimento</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {laminas.map(lam => (
                <div key={lam.id} className="card" style={{ backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>{lam.title}</h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>{lam.desc}</p>
                  <button 
                    className="btn-teal" 
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                    onClick={() => alert(`Simulando download do arquivo PDF de "${lam.title}"`)}
                  >
                    Baixar Lâmina PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CURSOS COMPLETOS */}
        {activeSubTab === 'cursos' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Plataforma de Capacitação Continuada</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {courses.map(course => {
                const progress = coursesProgress[course.id] || 0;
                return (
                  <div key={course.id} className="card" style={{ backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '10px', backgroundColor: 'var(--primary-teal-light)', color: 'var(--text-teal)', padding: '2px 6px', borderRadius: '4px' }}>{course.category}</span>
                      <h3 style={{ fontSize: '14px', marginTop: '8px', marginBottom: '2px' }}>{course.title}</h3>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Por {course.author}</span>
                    </div>

                    <div style={{ margin: '10px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span>Progresso do Curso</span>
                        <strong>{progress}%</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary-teal)', transition: 'width 0.4s ease' }}></div>
                      </div>
                    </div>

                    <button 
                      className="btn-teal" 
                      style={{ padding: '8px 12px', fontSize: '12px', marginTop: 'auto' }}
                      onClick={() => handleLessonComplete(course.id)}
                      disabled={progress >= 100}
                    >
                      {progress === 100 ? 'Curso Concluído ✓' : 'Marcar Aula Concluída'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WEBDIET CAST */}
        {activeSubTab === 'cast' && (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🎙️</span>
            <h2 style={{ fontSize: '18px', marginBottom: '6px' }}>WebDiet Cast - Podcast Exclusivo</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px auto' }}>
              Ouça episódios inéditos e debates científicos sobre clínica de obesidade, patologias e fitoterapia.
            </p>
            <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: '20px', borderRadius: '8px', maxWidth: '420px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '11px', color: 'var(--primary-teal)', fontWeight: 'bold' }}>EPISÓDIO RECENTE</div>
              <h3 style={{ fontSize: '15px', margin: '6px 0 16px 0' }}>Ep 15 - Resistência à Insulina e Dieta Cetogênica</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                <button className="icon-btn" onClick={() => alert('Voltando 15s...')} style={{ width: '40px', height: '40px' }}>◀◀</button>
                <button className="btn-teal" onClick={() => alert('Reproduzindo áudio simulado...')} style={{ width: '50px', height: '50px', borderRadius: '50%' }}>▶</button>
                <button className="icon-btn" onClick={() => alert('Avançando 15s...')} style={{ width: '40px', height: '40px' }}>▶▶</button>
              </div>
            </div>
          </div>
        )}

        {/* BIBLIOTECA CIENTÍFICA */}
        {activeSubTab === 'biblioteca' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Biblioteca de Artigos Científicos</h2>
            <div className="search-container" style={{ maxWidth: '400px', marginBottom: '20px' }}>
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                className="form-control search-input" 
                placeholder="Buscar artigos por tema ou palavra-chave..." 
                value={searchArticle}
                onChange={(e) => setSearchArticle(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredArticles.map(art => (
                <div key={art.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '14.5px', color: 'var(--primary-teal)' }}>{art.title}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', margin: '4px 0 8px 0' }}>{art.journal}</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}><strong>Resumo:</strong> {art.abstract}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CASOS CLÍNICOS */}
        {activeSubTab === 'casos' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Estudos de Casos Clínicos Reais</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {casosClinicos.map(cc => (
                <div key={cc.id} className="card" style={{ backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.03)', padding: '18px' }}>
                  <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '8px' }}>{cc.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '14px' }}>{cc.desc}</p>
                  <button className="btn-teal" style={{ width: 'auto', padding: '8px 16px', fontSize: '12px' }} onClick={() => alert(`Visualizando conduta clínica detalhada para "${cc.title}"`)}>
                    Visualizar Conduta Completa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PASTA COMPARTILHADA */}
        {activeSubTab === 'pasta' && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>📁</span>
            <h2 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '6px' }}>Pasta Compartilhada da Comunidade</h2>
            <p style={{ fontSize: '12.5px', marginBottom: '16px', maxWidth: '320px', margin: '0 auto' }}>
              Troque e faça o download de e-books, tabelas e laudos compartilhados por outros nutricionistas parceiros.
            </p>
            <button className="btn-teal" style={{ width: 'auto' }} onClick={() => alert('Carregando arquivos compartilhados pelos membros...')}>
              Carregar Arquivos Disponíveis
            </button>
          </div>
        )}

        {/* EBOOKS */}
        {activeSubTab === 'ebooks' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Livros Digitais & E-books Disponíveis</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {['Receitas Práticas para Café da Manhã', 'Guia de Suplementação Esportiva V2', 'Alergias e Intolerâncias na Infância'].map((book, idx) => (
                <div key={idx} className="card" style={{ backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>📖</span>
                  <h3 style={{ fontSize: '13.5px', marginBottom: '12px' }}>{book}</h3>
                  <button className="btn-teal" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={() => alert(`Iniciando download do E-book "${book}"`)}>
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BLOG */}
        {activeSubTab === 'blog' && (
          <div>
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Blog & Comunicados WebFit</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '10.5px', color: 'var(--primary-teal)' }}>18 JUNHO 2026</span>
                <h3 style={{ fontSize: '15px', margin: '4px 0 6px 0' }}>Nova Funcionalidade: Teleconsulta com Gravação Local</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Liberamos o novo painel de videochamadas integrado direto no WebFit para teleconsultas. 
                  Agora você pode compartilhar tela e atender seus pacientes sem necessidade de contas Zoom ou Google Meet.
                </p>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--primary-teal)' }}>12 JUNHO 2026</span>
                <h3 style={{ fontSize: '15px', margin: '4px 0 6px 0' }}>Como engajar seus pacientes no Diário Alimentar do App?</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  O uso do diário de fotos aumenta a adesão em até 70%. Veja algumas dicas de como incentivar seu paciente 
                  a fazer o envio das fotos no aplicativo móvel nas primeiras semanas de acompanhamento.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudiesPanel;
