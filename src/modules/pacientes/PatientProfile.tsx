import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Modal from '../shared/Modal';
import type { Patient, AnthropometryEntry } from '../../types';

interface PatientProfileProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onBack: () => void;
}

interface MealItem {
  food: string;
  measure: string;
  subs: string[];
}

interface Meal {
  name: string;
  time: string;
  items: MealItem[];
}

interface MealTemplates {
  [key: string]: Meal[];
}

const MEAL_TEMPLATES: MealTemplates = {
  'Cardápio Semanal': [
    {
      name: 'Café da Manhã',
      time: '08:00',
      items: [
        { food: 'Pão integral de fermentação natural', measure: '2 fatias (50g)', subs: ['Tapioca (3 colheres)', 'Cuscuz cozido (4 colheres)'] },
        { food: 'Ovo de galinha caipira mexido', measure: '2 unidades', subs: ['Queijo minas frescal (2 fatias)', 'Tofu grelhado (80g)'] },
        { food: 'Café preto sem açúcar', measure: '1 xícara (150ml)', subs: ['Chá de ervas sem açúcar (150ml)'] }
      ]
    },
    {
      name: 'Almoço',
      time: '12:30',
      items: [
        { food: 'Arroz branco cozido', measure: '100g (4 colheres de sopa)', subs: ['Batata doce cozida (120g)', 'Mandioca cozida (80g)', 'Macarrão integral cozido (90g)'] },
        { food: 'Feijão carioca cozido', measure: '80g (1 concha média)', subs: ['Lentilha cozida (80g)', 'Grão-de-bico cozido (70g)'] },
        { food: 'Peito de frango grelhado', measure: '120g (1 filé grande)', subs: ['Patinho moído grelhado (120g)', 'Filé de tilápia grelhado (150g)', 'Ovo mexido (3 unidades)'] },
        { food: 'Salada de folhas verdes com azeite', measure: 'À vontade', subs: ['Legumes cozidos no vapor (80g)'] }
      ]
    },
    {
      name: 'Lanche da Tarde',
      time: '16:00',
      items: [
        { food: 'Iogurte natural desnatado', measure: '1 copo (170g)', subs: ['Kefir de leite (150ml)', 'Iogurte de ovelha natural (100g)'] },
        { food: 'Frutas frescas picadas (Mamão/Morango)', measure: '120g', subs: ['Banana prata (1 unidade)', 'Maçã argentina (1 unidade)'] },
        { food: 'Castanha-do-pará', measure: '2 unidades (10g)', subs: ['Amêndoas torradas (10 unidades)', 'Nozes chilenas (3 unidades)'] }
      ]
    },
    {
      name: 'Jantar',
      time: '20:00',
      items: [
        { food: 'Crepioca fit (1 ovo + 1 colher tapioca)', measure: '1 unidade', subs: ['Wrap integral (1 folha Rap10 fit)', 'Omelete com legumes (2 ovos)'] },
        { food: 'Frango desfiado temperado', measure: '80g', subs: ['Atum ralado em água (1 lata)', 'Queijo cottage light (3 colheres de sopa)'] }
      ]
    }
  ],
  'Plano de Emagrecimento Definição': [
    {
      name: 'Café da Manhã',
      time: '07:30',
      items: [
        { food: 'Ovos cozidos inteiros', measure: '2 unidades', subs: ['Claras de ovos (4 claras)', 'Whey protein concentrado (1 scoop)'] },
        { food: 'Mamão formosa picado', measure: '150g', subs: ['Morango fresco (200g)', 'Melão picado (200g)'] }
      ]
    },
    {
      name: 'Almoço',
      time: '12:00',
      items: [
        { food: 'Arroz integral cozido', measure: '80g', subs: ['Batata inglesa cozida (100g)', 'Purê de abóbora (150g)'] },
        { food: 'Filé de tilápia grelhado', measure: '150g', subs: ['Peito de frango (130g)', 'Filé mignon suíno grelhado (120g)'] },
        { food: 'Brócolis e couve-flor no vapor', measure: '100g', subs: ['Aspargos grelhados (80g)', 'Salada verde à vontade'] }
      ]
    },
    {
      name: 'Lanche da Tarde',
      time: '15:30',
      items: [
        { food: 'Whey protein isolado', measure: '1 scoop (30g)', subs: ['Iogurte grego zero gordura (150g)'] },
        { food: 'Farelo de aveia', measure: '20g', subs: ['Sementes de chia (15g)', 'Sementes de linhaça (15g)'] }
      ]
    },
    {
      name: 'Jantar',
      time: '19:30',
      items: [
        { food: 'Patinho bovino grelhado', measure: '120g', subs: ['Peito de frango grelhado (130g)', 'Atum sólido em água (120g)'] },
        { food: 'Mix de folhas verdes com limão', measure: 'À vontade', subs: ['Legumes grelhados (100g)'] }
      ]
    }
  ],
  'Protocolo Hipertrofia Limpa': [
    {
      name: 'Café da Manhã',
      time: '07:30',
      items: [
        { food: 'Tapioca com ovos mexidos', measure: '3 colheres goma + 3 ovos', subs: ['Pão de forma integral (3 fatias) + Omelete (3 ovos)', 'Cuscuz com queijo coalho (100g) + 3 ovos'] },
        { food: 'Banana prata com mel', measure: '1 unidade + 1 colher sopa', subs: ['Uvas passas (30g)', 'Suco de uva integral (200ml)'] }
      ]
    },
    {
      name: 'Almoço',
      time: '12:30',
      items: [
        { food: 'Arroz branco cozido', measure: '150g', subs: ['Macarrão sêmola cozido (140g)', 'Purê de batata inglesa (200g)'] },
        { food: 'Feijão preto cozido', measure: '100g', subs: ['Lentilha cozida (100g)', 'Grão-de-bico cozido (90g)'] },
        { food: 'Patinho grelhado', measure: '150g', subs: ['Sobrecoxa de frango grelhada (150g)', 'Alcatra grelhada (150g)'] },
        { food: 'Suco de laranja natural', measure: '1 copo (200ml)', subs: ['Salada de frutas com aveia (100g)'] }
      ]
    },
    {
      name: 'Lanche da Tarde (Pré-Treino)',
      time: '16:00',
      items: [
        { food: 'Batata doce cozida', measure: '150g', subs: ['Mandioca cozida (110g)', 'Pão francês com geleia (1 unidade)'] },
        { food: 'Peito de frango desfiado', measure: '100g', subs: ['Atum ralado (1 lata)', 'Claras de ovos cozidas (5 unidades)'] }
      ]
    },
    {
      name: 'Pós-Treino Imediato',
      time: '18:00',
      items: [
        { food: 'Whey protein concentrado', measure: '1.5 scoops (45g)', subs: ['Beef protein (45g)', 'Claras de ovos desidratadas (40g)'] },
        { food: 'Dextrose ou Maltodextrina', measure: '30g', subs: ['Banana madura amassada (2 unidades)', 'Mel de abelha (2 colheres de sopa)'] }
      ]
    },
    {
      name: 'Jantar',
      time: '20:30',
      items: [
        { food: 'Arroz branco cozido', measure: '150g', subs: ['Batata doce cozida (180g)', 'Macarrão cozido (140g)'] },
        { food: 'Sobrecoxa de frango assada', measure: '150g', subs: ['Filé de salmão grelhado (150g)', 'Carne de porco magra (140g)'] },
        { food: 'Legumes no vapor (cenoura/abobrinha)', measure: '100g', subs: ['Brócolis refogado (100g)'] }
      ]
    }
  ],
  'Cardápio Low Carb Ajustado': [
    {
      name: 'Café da Manhã',
      time: '08:00',
      items: [
        { food: 'Omelete de queijo e tomate', measure: '3 ovos + 30g queijo', subs: ['Ovos mexidos com manteiga (3 ovos)', 'Abacate com ovos cozidos'] },
        { food: 'Café preto com óleo de coco', measure: '1 xícara + 1 colher chá', subs: ['Chá verde gelado sem açúcar (200ml)'] }
      ]
    },
    {
      name: 'Almoço',
      time: '12:30',
      items: [
        { food: 'Sobrecoxa de frango assada com pele', measure: '160g', subs: ['Filé de salmão grelhado (160g)', 'Costela suína assada (150g)'] },
        { food: 'Salada de folhas verdes (rúcula, alface)', measure: 'À vontade', subs: ['Espinafre refogado no alho (100g)'] },
        { food: 'Abobrinha e berinjela grelhadas no azeite', measure: '120g', subs: ['Brócolis gratinado com queijo (100g)'] }
      ]
    },
    {
      name: 'Lanche da Tarde',
      time: '16:30',
      items: [
        { food: 'Mix de oleaginosas (nozes, macadâmias)', measure: '35g', subs: ['Queijo provolone desidratado (30g)', 'Abacate picado com limão (100g)'] }
      ]
    },
    {
      name: 'Jantar',
      time: '20:00',
      items: [
        { food: 'Sopa cremosa de abóbora com carne moída', measure: '1 prato fundo (300ml)', subs: ['Omelete de espinafre com bacon (3 ovos)', 'Filé de tilápia com legumes no vapor (150g)'] }
      ]
    }
  ],
  'Planejamento Gestacional Fit': [
    {
      name: 'Café da Manhã',
      time: '08:00',
      items: [
        { food: 'Iogurte natural integral com chia', measure: '170g + 1 colher sopa', subs: ['Leite integral morno com cacau (200ml)'] },
        { food: 'Pão de aveia com ovos mexidos', measure: '1 fatia + 2 ovos', subs: ['Tapioca com queijo cottage e gergelim (1 unidade)'] },
        { food: 'Mamão picado', measure: '100g', subs: ['Kiwi (2 unidades)', 'Laranja com bagaço (1 unidade)'] }
      ]
    },
    {
      name: 'Colação',
      time: '10:30',
      items: [
        { food: 'Castanha-do-pará (fonte de selênio)', measure: '2 unidades', subs: ['Amêndoas (10 unidades)'] }
      ]
    },
    {
      name: 'Almoço',
      time: '12:30',
      items: [
        { food: 'Arroz integral cozido', measure: '100g', subs: ['Quinoa cozida (100g)', 'Batata doce cozida (120g)'] },
        { food: 'Feijão preto cozido (rico em ferro)', measure: '80g', subs: ['Lentilha cozida (80g)', 'Ervilha cozida (80g)'] },
        { food: 'Filé de frango grelhado', measure: '120g', subs: ['Filé de peixe cozido (130g)', 'Carne bovina magra grelhada (100g)'] },
        { food: 'Salada de couve refogada (ácido fólico)', measure: '100g', subs: ['Brócolis cozido (100g)'] }
      ]
    },
    {
      name: 'Lanche da Tarde',
      time: '16:00',
      items: [
        { food: 'Banana prata com aveia e canela', measure: '1 unidade + 1 colher sopa', subs: ['Maçã assada com canela + castanhas'] },
        { food: 'Queijo minas frescal pasteurizado', measure: '2 fatias (50g)', subs: ['Iogurte natural (170g)'] }
      ]
    },
    {
      name: 'Jantar',
      time: '19:30',
      items: [
        { food: 'Sopa de legumes com carne e macarrão', measure: '1 prato fundo (350ml)', subs: ['Crepioca com queijo e tomate (1 unidade) + Suco de uva', 'Arroz com frango desfiado e cenoura ralada'] }
      ]
    }
  ]
};

interface ClinicalExam {
  name: string;
  value: number;
  status: string;
  note: string;
}

interface ClinicalExams {
  [key: string]: ClinicalExam[];
}

const CLINICAL_EXAMS: ClinicalExams = {
  '1': [
    { name: 'Hemoglobina Glicada (HbA1c)', value: 5.4, status: 'Normal', note: 'Excelente controle glicêmico.' },
    { name: 'Colesterol HDL', value: 48, status: 'Atenção', note: 'Levemente baixo para o sexo feminino (Referência > 50 mg/dL). Recomenda-se incentivar gorduras boas (azeite, abacate).' },
    { name: 'Ferro Sérico', value: 42, status: 'Atenção', note: 'Abaixo do recomendado para mulheres (Referência 50-170 mcg/dL). Atenção especial pós-bariátrica.' },
    { name: 'Vitamina B12', value: 180, status: 'Alerta', note: 'Deficiência detectada (Referência 200-900 pg/mL). Necessária suplementação devido à bariátrica.' },
    { name: 'Glicose em Jejum', value: 88, status: 'Normal', note: 'Glicemia de jejum adequada.' }
  ],
  '5': [
    { name: 'Hemoglobina Glicada (HbA1c)', value: 5.9, status: 'Atenção', note: 'Pré-diabetes detectada (Referência 5.7% - 6.4%). Foco em dieta de baixo índice glicêmico e atividades físicas.' },
    { name: 'Colesterol HDL', value: 45, status: 'Normal', note: 'Adequado para o sexo masculino (Referência > 40 mg/dL).' },
    { name: 'Ferro Sérico', value: 95, status: 'Normal', note: 'Dentro da normalidade.' },
    { name: 'Vitamina B12', value: 410, status: 'Normal', note: 'Adequado.' },
    { name: 'Glicose em Jejum', value: 104, status: 'Atenção', note: 'Levemente elevada (Referência < 100 mg/dL). Foco em restrição de carboidratos refinados.' }
  ],
  'default': [
    { name: 'Hemoglobina Glicada (HbA1c)', value: 5.2, status: 'Normal', note: 'Normal.' },
    { name: 'Colesterol HDL', value: 55, status: 'Normal', note: 'Normal.' },
    { name: 'Ferro Sérico', value: 80, status: 'Normal', note: 'Normal.' },
    { name: 'Vitamina B12', value: 350, status: 'Normal', note: 'Normal.' },
    { name: 'Glicose em Jejum', value: 90, status: 'Normal', note: 'Normal.' }
  ]
};

type ProfileTab = 'perfil' | 'anamnese' | 'prescrever' | 'exames' | 'preconsulta' | 'metas' | 'diario' | 'impressos' | 'retorno';
type AntroTab = 'basico' | 'circunferencias' | 'dobras';

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onEdit, onBack }) => {
  const { 
    userProfile, 
    toggleBlackStatus, 
    addPrescription, 
    addAppointment,
    appointments,
    sendChatMessage,
    notifications,
    addTransaction
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState<ProfileTab>('perfil');
  
  // Toggles for patient access
  const [linkAccess, setLinkAccess] = useState(true);
  const [appAccess, setAppAccess] = useState(true);
  const [plusAccess, setPlusAccess] = useState(true);

  // Anthropometria states — Básico
  const [showAntropometriaModal, setShowAntropometriaModal] = useState(false);
  const [antroTab, setAntroTab] = useState<AntroTab>('basico');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bfPercentage, setBfPercentage] = useState('');

  // Circunferências corporais
  const [circWaist, setCircWaist] = useState('');
  const [circHip, setCircHip] = useState('');
  const [circAbdomen, setCircAbdomen] = useState('');
  const [circArm, setCircArm] = useState('');
  const [circForearm, setCircForearm] = useState('');
  const [circThigh, setCircThigh] = useState('');
  const [circCalf, setCircCalf] = useState('');
  const [circNeck, setCircNeck] = useState('');
  const [circChest, setCircChest] = useState('');

  // Dobras cutâneas (mm)
  const [sfChest, setSfChest] = useState('');
  const [sfSubscapular, setSfSubscapular] = useState('');
  const [sfTriceps, setSfTriceps] = useState('');
  const [sfAxillarMid, setSfAxillarMid] = useState('');
  const [sfSuprailiac, setSfSuprailiac] = useState('');
  const [sfAbdomen, setSfAbdomen] = useState('');
  const [sfThigh, setSfThigh] = useState('');

  const [antropometriaHistory, setAntropometriaHistory] = useState<AnthropometryEntry[]>([
    {
      id: '1',
      date: '22/06/2026',
      weight: '72.5',
      height: '1.68',
      bf: '24.2',
      bmi: '25.7',
      circunferencias: { cintura: '72', quadril: '98', abdomen: '78' },
      dobras: { triceps: '18', subescapular: '14', suprailiaca: '16' }
    }
  ]);

  // Tab states
  const [prescriptionType, setPrescriptionType] = useState('Cardápio Semanal');
  const [selectedTemplate, setSelectedTemplate] = useState('mt1');
  const [preconsultaSent, setPreconsultaSent] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  const [patientGoals, setPatientGoals] = useState([
    { id: 'g1', text: 'Consumir 2.5L de água por dia', done: false },
    { id: 'g2', text: 'Treinar musculação 4x na semana', done: true },
    { id: 'g3', text: 'Evitar alimentos ultraprocessados', done: false }
  ]);
  const [mealComments, setMealComments] = useState<{ [key: string]: string }>({});
  const [printedDocType, setPrintedDocType] = useState('Receituário de Suplementação');
  const [returnDate, setReturnDate] = useState('2026-07-15');
  const [returnTime, setReturnTime] = useState('14:00');
  const [returnType, setReturnType] = useState<'Presencial' | 'Online'>('Presencial');

  const calculateAge = (birthDateStr: string) => {
    if (!birthDateStr) return 'Não informada';
    const birthDate = new Date(birthDateStr);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + ' anos';
  };

  const handleEmitPrescription = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPrescription(prescriptionType, patient.id);
    alert(`Prescrição (${prescriptionType}) emitida com sucesso para ${patient.name}! Ela agora aparece no bloco 'Prescrições recentes'.`);
  };

  const handleSendPreconsulta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPreconsultaSent(true);
    setTimeout(() => {
      alert(`Formulário de Pré-consulta enviado por e-mail e WhatsApp para ${patient.name}!`);
    }, 100);
  };

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newGoalText.trim() === '') return;
    setPatientGoals(prev => [
      ...prev,
      { id: Date.now().toString(), text: newGoalText, done: false }
    ]);
    setNewGoalText('');
  };

  const toggleGoal = (goalId: string) => {
    setPatientGoals(prev => prev.map(g => {
      if (g.id === goalId) return { ...g, done: !g.done };
      return g;
    }));
  };

  const handleCommentMeal = (notiId: string, text: string) => {
    setMealComments(prev => ({
      ...prev,
      [notiId]: text
    }));
    sendChatMessage(patient.id, `Comentário sobre sua refeição: "${text}"`, 'doctor');
    alert('Seu feedback foi registrado e enviado ao chat do paciente!');
  };

  const handleScheduleReturn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addAppointment({
      patientId: patient.id,
      date: returnDate,
      time: returnTime,
      type: returnType
    });
    addTransaction(patient.id, 250, 'PIX');
    alert(`Retorno agendado com sucesso para o dia ${returnDate} às ${returnTime} (${returnType}). Faturamento financeiro gerado!`);
  };

  // Filter notifications (diario photos) belonging to this patient
  const patientDiarioPosts = notifications.filter(n => n.patientId === patient.id);

  // Return appointments list for this patient
  const patientAppointments = appointments.filter(ap => ap.patientId === patient.id);

  return (
    <div className="patients-container">
      {/* Profile Header */}
      <div className="patient-profile-header">
        <div className="profile-identity">
          <div className="profile-large-avatar">
            <img 
              src={patient.gender === 'Masculino' 
                ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' 
                : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
              } 
              alt="Avatar do Paciente" 
            />
          </div>
          <div className="profile-name-area">
            <h1>{patient.name}</h1>
            <div className="tag-list" style={{ alignItems: 'center' }}>
              {patient.tags && patient.tags.map((tag, idx) => (
                <span key={idx} className="tag-badge">{tag}</span>
              ))}
              <span className="tag-badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
                Status: {patient.status}
              </span>
              <button 
                onClick={() => setActiveTab('exames')} 
                style={{ 
                  background: 'var(--primary-teal-light)', 
                  color: 'var(--text-teal)', 
                  border: '1px solid var(--primary-teal-border)', 
                  padding: '3px 10px', 
                  borderRadius: '12px', 
                  fontSize: '11px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'var(--transition-fast)'
                }}
                className="btn-exame-atalho"
              >
                Atalhos: 🩺 Entrar na Análise
              </button>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-teal" onClick={() => onEdit(patient)} style={{ width: 'auto' }}>
            Editar Ficha
          </button>
          <button 
            className="btn-teal" 
            style={{ width: 'auto', backgroundColor: 'var(--bg-card-hover)', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={onBack}
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Grid Layout: Sidebar & Tabs */}
      <div className="profile-body-grid">
        {/* Sidebar Info */}
        <div className="patient-info-sidebar">
          <div className="info-sidebar-block">
            <h3>Dados Pessoais</h3>
            <div className="info-item">
              <label>Nome Social / Apelido</label>
              <span>{patient.nickname || 'Nenhum'}</span>
            </div>
            <div className="info-item">
              <label>CPF</label>
              <span>{patient.cpf || 'Não informado'}</span>
            </div>
            <div className="info-item">
              <label>Data de Nascimento</label>
              <span>{patient.birthDate ? patient.birthDate.split('-').reverse().join('/') : 'Não informada'}</span>
            </div>
            <div className="info-item">
              <label>Idade</label>
              <span>{calculateAge(patient.birthDate)}</span>
            </div>
            <div className="info-item">
              <label>Gênero</label>
              <span>{patient.gender}</span>
            </div>
          </div>

          <div className="info-sidebar-block">
            <h3>Contato</h3>
            <div className="info-item">
              <label>Celular / WhatsApp</label>
              <span>{patient.phone || 'Não informado'}</span>
            </div>
            <div className="info-item">
              <label>E-mail</label>
              <span>{patient.email || 'Não informado'}</span>
            </div>
          </div>
        </div>

        {/* Tab Area */}
        <div className="profile-content-area">
          {/* Tabs header */}
          <div className="tabs-menu">
            <button className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>Perfil do Paciente</button>
            <button className={`tab-btn ${activeTab === 'anamnese' ? 'active' : ''}`} onClick={() => setActiveTab('anamnese')}>Anamnese Geral</button>
            <button className={`tab-btn ${activeTab === 'prescrever' ? 'active' : ''}`} onClick={() => setActiveTab('prescrever')}>Cardápio</button>
            <button className={`tab-btn ${activeTab === 'exames' ? 'active' : ''}`} onClick={() => setActiveTab('exames')}>Exames</button>
            <button className={`tab-btn ${activeTab === 'preconsulta' ? 'active' : ''}`} onClick={() => setActiveTab('preconsulta')}>Pré-consulta</button>
            <button className={`tab-btn ${activeTab === 'metas' ? 'active' : ''}`} onClick={() => setActiveTab('metas')}>iMetas</button>
            <button className={`tab-btn ${activeTab === 'diario' ? 'active' : ''}`} onClick={() => setActiveTab('diario')}>Diário Alimentar</button>
            <button className={`tab-btn ${activeTab === 'impressos' ? 'active' : ''}`} onClick={() => setActiveTab('impressos')}>Impressos</button>
            <button className={`tab-btn ${activeTab === 'retorno' ? 'active' : ''}`} onClick={() => setActiveTab('retorno')}>Retorno</button>
          </div>

          {/* Tab contents */}
          <div className="tab-content">
            {/* PERFIL DO PACIENTE */}
            {activeTab === 'perfil' && (
              <div className="perfil-tab-container">
                {/* 1. Dados básicos */}
                <div className="perfil-section-card">
                  <div className="perfil-card-header">
                    <h3>Dados básicos</h3>
                    <button className="perfil-edit-btn" onClick={() => onEdit(patient)}>Editar</button>
                  </div>
                  <div className="basic-data-grid">
                    <div className="basic-data-avatar-container">
                      <div className="avatar-wrapper">
                        <img 
                          src={patient.gender === 'Masculino' 
                            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' 
                            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                          } 
                          alt="Avatar do Paciente" 
                        />
                      </div>
                    </div>
                    <div className="basic-data-info-grid">
                      <div className="info-field-box">
                        <label>Nome completo</label>
                        <div className="info-field-value">{patient.name}</div>
                      </div>
                      <div className="info-fields-row">
                        <div className="info-field-box">
                          <label>Data de nascimento</label>
                          <div className="info-field-value">{patient.birthDate ? patient.birthDate.split('-').reverse().join('/') : 'Não informada'}</div>
                        </div>
                        <div className="info-field-box">
                          <label>Telefone com DDD</label>
                          <div className="info-field-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{patient.phone || 'Não informado'}</span>
                            {patient.phone && (
                              <a 
                                href={`https://wa.me/${patient.phone.replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="whatsapp-icon-link"
                                title="Falar no WhatsApp"
                                style={{ display: 'inline-flex', color: '#25D366' }}
                              >
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.528 2.012 14.07 1.002 11.47 1.002c-5.443 0-9.87 4.37-9.874 9.8-.001 1.737.457 3.432 1.328 4.93L1.919 21.1l5.578-1.456c-.287.165-.589.336-.85.51zM17.487 14.4c-.27-.136-1.602-.79-1.85-.88-.25-.09-.432-.136-.612.136-.18.273-.697.88-.853 1.06-.157.18-.314.2-.584.065-.27-.136-1.138-.42-2.17-1.34-1.03-.92-1.724-2.06-1.927-2.4-.203-.34-.022-.523.147-.69.153-.15.314-.365.47-.55.158-.18.21-.31.315-.515.105-.2.052-.38-.026-.517-.078-.135-.612-1.482-.84-2.028-.22-.53-.442-.46-.61-.47h-.52c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27s.98 2.62 1.11 2.8c.14.18 1.93 2.94 4.67 4.12.65.28 1.16.45 1.56.57.65.2 1.25.18 1.72.11.53-.08 1.6-.66 1.83-1.28.23-.62.23-1.16.16-1.28-.07-.1-.26-.18-.53-.32z"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="info-fields-row">
                        <div className="info-field-box">
                          <label>Link do paciente <span className="help-info-icon" title="O paciente pode acessar seus planos alimentares e orientações por este link público.">ⓘ</span></label>
                          <div className="link-copy-wrapper">
                            <span className="patient-link-url">{`https://paciente.me/${patient.id}`}</span>
                            <div className="link-actions">
                              <button 
                                className="link-action-btn"
                                title="Copiar Link"
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://paciente.me/${patient.id}`);
                                  alert('Link do paciente copiado para a área de transferência!');
                                }}
                              >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                              </button>
                              <a 
                                href={`https://paciente.me/${patient.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-action-btn"
                                title="Abrir Link"
                              >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                  <polyline points="15 3 21 3 21 9"></polyline>
                                  <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="info-field-box">
                          <label>Já logou no aplicativo?</label>
                          <div className="info-field-value status-badge-no">Não</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Fluxo de consulta */}
                <div className="perfil-section-card">
                  <div className="perfil-card-header">
                    <h3>Fluxo de consulta</h3>
                    <button className="perfil-config-btn" onClick={() => alert('Configuração do fluxo de consulta disponível no plano profissional.')}>Configurar</button>
                  </div>
                  <div className="flow-shortcuts-grid">
                    <button className="flow-shortcut-card" onClick={() => setActiveTab('retorno')}>
                      <div className="flow-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="flow-label">registrar consulta</span>
                    </button>
                    <button className="flow-shortcut-card" onClick={() => setActiveTab('retorno')}>
                      <div className="flow-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <span className="flow-label">agendar paciente</span>
                    </button>
                    <button className="flow-shortcut-card" onClick={() => setActiveTab('anamnese')}>
                      <div className="flow-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <span className="flow-label">adicionar anamnese</span>
                    </button>
                    <button className="flow-shortcut-card" onClick={() => setShowAntropometriaModal(true)}>
                      <div className="flow-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="4" x2="12" y2="20"></line>
                          <line x1="9" y1="20" x2="15" y2="20"></line>
                          <path d="M18 20V10a6 6 0 0 0-12 0v10"></path>
                        </svg>
                      </div>
                      <span className="flow-label">adicionar antropometria</span>
                    </button>
                    <button className="flow-shortcut-card" onClick={() => setActiveTab('prescrever')}>
                      <div className="flow-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <span className="flow-label">adicionar planejamento</span>
                    </button>
                    <button className="flow-shortcut-card" onClick={() => setActiveTab('impressos')}>
                      <div className="flow-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <span className="flow-label">adicionar orientação</span>
                    </button>
                    <button className="flow-shortcut-card" onClick={() => setActiveTab('impressos')}>
                      <div className="flow-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 2v7.586l7.243 7.243a2 2 0 0 1 0 2.828v0a2 2 0 0 1-2.828 0L7.172 12.414A2 2 0 0 1 6.586 11V2h4z"></path>
                          <line x1="3" y1="22" x2="21" y2="22"></line>
                        </svg>
                      </div>
                      <span className="flow-label">adicionar manipulados</span>
                    </button>
                  </div>
                </div>

                {/* 3. Ajustes do paciente */}
                <div className="perfil-section-card">
                  <div className="perfil-card-header">
                    <h3>Ajustes do paciente</h3>
                  </div>
                  <div className="settings-toggles-list">
                    <div className="settings-toggle-row">
                      <span className="toggle-label">Habilitar acesso ao link do paciente (conteúdos do paciente.me/{patient.id})</span>
                      <label className="switch-toggle">
                        <input type="checkbox" checked={linkAccess} onChange={(e) => setLinkAccess(e.target.checked)} />
                        <span className="switch-slider"></span>
                      </label>
                    </div>
                    <div className="settings-toggle-row">
                      <span className="toggle-label">Habilitar acesso ao aplicativo WebDiet</span>
                      <label className="switch-toggle">
                        <input type="checkbox" checked={appAccess} onChange={(e) => setAppAccess(e.target.checked)} />
                        <span className="switch-slider"></span>
                      </label>
                    </div>
                    <div className="settings-toggle-row">
                      <span className="toggle-label">Habilitar acesso ao aplicativo WebDiet+ para o paciente</span>
                      <label className="switch-toggle">
                        <input type="checkbox" checked={plusAccess} onChange={(e) => setPlusAccess(e.target.checked)} />
                        <span className="switch-slider"></span>
                      </label>
                    </div>
                    <div className="settings-toggle-row" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px', marginTop: '4px' }}>
                      <span className="toggle-label" style={{ color: 'var(--text-secondary)' }}>Demais ajustes de aplicativo WebDiet</span>
                      <button className="perfil-config-btn" onClick={() => alert('Configurações adicionais abertas.')}>Configurar</button>
                    </div>
                  </div>
                </div>

                {/* 4. Diário alimentar */}
                <div className="perfil-section-card">
                  <div className="perfil-card-header">
                    <h3>Diário alimentar</h3>
                  </div>
                  <div className="diario-summary-body">
                    {patientDiarioPosts.length === 0 ? (
                      <p className="no-diario-message">
                        Nenhuma foto de diário alimentar foi enviada pelo seu paciente. Você pode solicitar que ele use o aplicativo para enviar as fotos e você acompanhar o andamento do plano alimentar.
                      </p>
                    ) : (
                      <div className="diario-summary-active">
                        <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          O paciente já enviou {patientDiarioPosts.length} postagens no diário alimentar.
                        </p>
                        <button className="btn-teal" style={{ width: 'auto' }} onClick={() => setActiveTab('diario')}>
                          Ver Diário Alimentar do Paciente
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ANAMNESE */}
            {activeTab === 'anamnese' && (
              <div>
                <h3 style={{ marginBottom: '12px' }}>Anamnese / Histórico Clínico</h3>
                <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                  {patient.notes || 'Nenhuma nota clínica cadastrada para este paciente. Clique em "Editar Ficha" acima para adicionar anamnese e observações clínicas relevantes.'}
                </p>
              </div>
            )}

            {/* CARDÁPIO */}
            {activeTab === 'prescrever' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>Prescrever Plano Alimentar / Cardápio</h3>
                <form onSubmit={handleEmitPrescription} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', marginBottom: '24px' }}>
                  <div className="form-group">
                    <label>Tipo de Prescrição</label>
                    <select 
                      className="form-control" 
                      value={prescriptionType} 
                      onChange={(e) => setPrescriptionType(e.target.value)}
                    >
                      <option value="Cardápio Semanal">Cardápio Semanal Padrão</option>
                      <option value="Plano de Emagrecimento Definição">Plano de Emagrecimento / Definição</option>
                      <option value="Protocolo Hipertrofia Limpa">Protocolo Hipertrofia Limpa</option>
                      <option value="Cardápio Low Carb Ajustado">Cardápio Low Carb Ajustado</option>
                      <option value="Planejamento Gestacional Fit">Planejamento Gestacional Fit</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Observações da Prescrição</label>
                    <textarea className="form-control" rows={3} placeholder="Restrições adicionais, horários de suplementos..."></textarea>
                  </div>
                  <button type="submit" className="btn-teal" style={{ width: 'auto', alignSelf: 'flex-start' }}>
                    Emitir Cardápio
                  </button>
                </form>

                {/* VISUALIZAÇÃO DO CARDÁPIO ATUAL COM SUBSTITUIÇÕES EM LINHA */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>Visualização do Cardápio Ativo</h3>
                    <span style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: '600' }}>
                      📋 {prescriptionType}
                    </span>
                  </div>
                  
                  {(MEAL_TEMPLATES[prescriptionType] || MEAL_TEMPLATES['Cardápio Semanal']).map((meal, mealIdx) => (
                    <div key={mealIdx} className="meal-section">
                      <div className="meal-header">
                        <span className="meal-title">
                          🍴 {meal.name}
                        </span>
                        <span className="meal-time">🕒 {meal.time}</span>
                      </div>
                      
                      <div className="meal-items-list">
                        {meal.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="meal-item-row">
                            <div className="meal-food-info">
                              <span className="food-name">{item.food}</span>
                              <span className="food-measure">[{item.measure}]</span>
                            </div>
                            <div className="meal-arrow">➔</div>
                            <div className="meal-subs-tags">
                              {item.subs.map((sub, subIdx) => (
                                <span key={subIdx} className="meal-sub-badge">{sub}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXAMES BIOQUÍMICOS */}
            {activeTab === 'exames' && (
              <div>
                <h3 style={{ marginBottom: '12px' }}>Análise de Exames Bioquímicos</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                  Acompanhamento clínico com valores de referência ajustados dinamicamente para o sexo: <strong>{patient.gender}</strong>.
                </p>

                <div className="exams-table-container">
                  <table className="exams-table">
                    <thead>
                      <tr>
                        <th>Parâmetro</th>
                        <th>Resultado</th>
                        <th>Status</th>
                        <th>Faixa de Referência ({patient.gender === 'Masculino' ? 'Masculino' : 'Feminino'})</th>
                        <th>Observação / Conduta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(CLINICAL_EXAMS[patient.id] || CLINICAL_EXAMS['default']).map((exam, idx) => {
                        let refRange = '';
                        let badgeClass = 'status-normal';
                        
                        if (exam.name.includes('Colesterol HDL')) {
                          refRange = patient.gender === 'Masculino' ? '> 40 mg/dL' : '> 50 mg/dL';
                          badgeClass = exam.value < (patient.gender === 'Masculino' ? 40 : 50) ? 'status-attention' : 'status-normal';
                        } else if (exam.name.includes('Ferro Sérico')) {
                          refRange = patient.gender === 'Masculino' ? '65 - 175 mcg/dL' : '50 - 170 mcg/dL';
                          const minVal = patient.gender === 'Masculino' ? 65 : 50;
                          const maxVal = patient.gender === 'Masculino' ? 175 : 170;
                          badgeClass = (exam.value < minVal || exam.value > maxVal) ? 'status-attention' : 'status-normal';
                        } else if (exam.name.includes('Hemoglobina Glicada')) {
                          refRange = '< 5.7% (Normal) | 5.7%-6.4% (Atenção) | >= 6.5% (Diabetes)';
                          if (exam.value >= 6.5) {
                            badgeClass = 'status-danger';
                          } else if (exam.value >= 5.7) {
                            badgeClass = 'status-attention';
                          } else {
                            badgeClass = 'status-normal';
                          }
                        } else if (exam.name.includes('Vitamina B12')) {
                          refRange = '200 - 900 pg/mL';
                          badgeClass = exam.value < 200 ? 'status-danger' : exam.value < 300 ? 'status-attention' : 'status-normal';
                        } else if (exam.name.includes('Glicose')) {
                          refRange = '70 - 99 mg/dL';
                          badgeClass = (exam.value < 70 || exam.value >= 100) ? 'status-attention' : 'status-normal';
                        }

                        // Use custom status from JSON if defined as Alerta/Deficiência
                        if (exam.status === 'Alerta') {
                          badgeClass = 'status-danger';
                        }

                        return (
                          <tr key={idx}>
                            <td><strong>{exam.name}</strong></td>
                            <td>{exam.value} {exam.name.includes('Hemoglobina') ? '%' : exam.name.includes('Vitamina') ? 'pg/mL' : exam.name.includes('Glicose') || exam.name.includes('Colesterol') ? 'mg/dL' : 'mcg/dL'}</td>
                            <td>
                              <span className={`exam-status-badge ${badgeClass}`}>
                                {badgeClass === 'status-normal' ? 'Normal' : badgeClass === 'status-attention' ? 'Atenção' : 'Alerta'}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{refRange}</td>
                            <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{exam.note}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="exam-reference-box">
                  <strong>💡 Informação de Referência Clínica:</strong> Os exames alterados acionam lembretes na conduta do prontuário para que o profissional recomende alimentos ricos nas frações deficientes (ex: couve/feijão para ferro baixo, salmão/chia para HDL baixo, suplementação sublingual ou aumento de carne para B12 sob baixa absorção).
                </div>
              </div>
            )}

            {/* PRECONSULTA */}
            {activeTab === 'preconsulta' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>Formulário de Pré-consulta</h3>
                <form onSubmit={handleSendPreconsulta} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', marginBottom: '32px' }}>
                  <div className="form-group">
                    <label>Selecionar Modelo de Questionário</label>
                    <select 
                      className="form-control" 
                      value={selectedTemplate} 
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                      <option value="mt3">Instruções de Pré-consulta Geral</option>
                      <option value="mt1">Boas-vindas ao consultório</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-teal" style={{ width: 'auto', alignSelf: 'flex-start' }}>
                    Enviar Formulário de Pré-consulta
                  </button>
                </form>

                {preconsultaSent && (
                  <div style={{ padding: '16px', backgroundColor: 'var(--primary-teal-light)', border: '1px solid var(--primary-teal-border)', borderRadius: '6px', marginBottom: '24px' }}>
                    <strong>✓ Enviado:</strong> Link de pré-consulta gerado e disparado. Aguardando respostas.
                  </div>
                )}

                <h3 style={{ marginBottom: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>Respostas Enviadas</h3>
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)', padding: '16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '600' }}>Questionário Clínico Geral</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Preenchido em 18/06/2026 - 15:40</span>
                  </div>
                  <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ fontSize: '13px' }}><strong>1. Qual o seu principal objetivo?</strong> Reeducação e perda de peso leve, melhorar sono.</li>
                    <li style={{ fontSize: '13px' }}><strong>2. Possui restrições ou alergias?</strong> Intolerância leve à lactose. Evita camarão.</li>
                    <li style={{ fontSize: '13px' }}><strong>3. Pratica atividades físicas?</strong> Caminhadas na esteira 3x por semana.</li>
                    <li style={{ fontSize: '13px' }}><strong>4. Qual o seu maior obstáculo alimentar?</strong> Vontade excessiva de doces à noite.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* METAS (BLACK SCREEN WITH UPGRADE ACTION) */}
            {activeTab === 'metas' && (
              <div>
                {!userProfile.isBlack ? (
                  <div className="black-lock-screen">
                    <span style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</span>
                    <div className="lock-title">iMetas - Recurso WebDiet Black</div>
                    <p className="lock-desc">
                      A definição e acompanhamento gráfico de metas para pacientes é exclusiva para assinantes do **WebDiet Black**. 
                      Eleve seus atendimentos com iMetas, MoveHealth e Inteligência Artificial!
                    </p>
                    <button className="btn-teal" style={{ width: 'auto' }} onClick={toggleBlackStatus}>
                      Experimentar WebDiet Black Gratuitamente
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ marginBottom: '12px' }}>iMetas do Paciente (Membro Black)</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                      Defina metas de hábitos e acompanhe a evolução do paciente nas consultas.
                    </p>

                    <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ex: Comer 3 porções de frutas por dia" 
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                      />
                      <button type="submit" className="btn-teal" style={{ width: 'auto' }}>Adicionar Meta</button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {patientGoals.map(goal => (
                        <div key={goal.id} className={`task-item ${goal.done ? 'done' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                          <div 
                            className={`task-checkbox ${goal.done ? 'checked' : ''}`}
                            onClick={() => toggleGoal(goal.id)}
                          >
                            {goal.done && '✓'}
                          </div>
                          <span className="task-text">{goal.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DIARIO ALIMENTAR */}
            {activeTab === 'diario' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>Diário Alimentar do Paciente</h3>
                {patientDiarioPosts.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    Este paciente ainda não enviou fotos no diário alimentar. 
                    (Dica: Use a notificação "20" no canto superior direito para simular o upload de fotos).
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {patientDiarioPosts.map(post => (
                      <div 
                        key={post.id} 
                        style={{ 
                          display: 'flex', 
                          gap: '16px', 
                          border: '1px solid rgba(255, 255, 255, 0.05)', 
                          padding: '16px', 
                          borderRadius: '8px',
                          backgroundColor: 'rgba(0,0,0,0.1)'
                        }}
                      >
                        <div style={{ width: '120px', height: '120px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                          <img src={post.mealPhoto} alt="Refeição" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Enviado em {post.timestamp}</span>
                            <h4 style={{ margin: '4px 0', fontSize: '15px' }}>{post.mealName}</h4>
                          </div>
                          
                          <div style={{ marginTop: '12px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Comentário / Feedback do Nutri</label>
                            {mealComments[post.id] ? (
                              <div style={{ fontSize: '13px', backgroundColor: 'var(--bg-card-hover)', padding: '8px 12px', borderRadius: '4px', borderLeft: '3px solid var(--primary-teal)' }}>
                                {mealComments[post.id]}
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="Escreva um feedback rápido..." 
                                  style={{ padding: '6px 12px' }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleCommentMeal(post.id, (e.target as HTMLInputElement).value);
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }}
                                />
                                <button 
                                  className="btn-teal" 
                                  style={{ width: 'auto', padding: '0 12px' }}
                                  onClick={(e) => {
                                    const input = (e.currentTarget as HTMLButtonElement).previousSibling as HTMLInputElement;
                                    if (input && input.value) {
                                      handleCommentMeal(post.id, input.value);
                                      input.value = '';
                                    }
                                  }}
                                >
                                  Enviar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* IMPRESSOS */}
            {activeTab === 'impressos' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>Modelos de Impressos e Documentos</h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert(`[Impressos] PDF para "${printedDocType}" gerado com sucesso! Iniciando download simulado.`);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}
                >
                  <div className="form-group">
                    <label>Tipo de Documento</label>
                    <select 
                      className="form-control" 
                      value={printedDocType} 
                      onChange={(e) => setPrintedDocType(e.target.value)}
                    >
                      <option value="Receituário de Suplementação">Receituário de Suplementação</option>
                      <option value="Atestado de Acompanhamento Nutricional">Atestado de Acompanhamento Nutricional</option>
                      <option value="Laudo Clínico para Cirurgia">Laudo Clínico para Cirurgia (Ex: Bariátrica)</option>
                      <option value="Termo de Consentimento Livre e Esclarecido">Termo de Consentimento Livre e Esclarecido</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-teal" style={{ width: 'auto', alignSelf: 'flex-start' }}>
                    Gerar PDF / Imprimir
                  </button>
                </form>
              </div>
            )}

            {/* RETORNO */}
            {activeTab === 'retorno' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>Agendar Consulta de Retorno</h3>
                <form onSubmit={handleScheduleReturn} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                  <div className="form-group">
                    <label>Data da Consulta</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={returnDate} 
                      onChange={(e) => setReturnDate(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Horário</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      value={returnTime} 
                      onChange={(e) => setReturnTime(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Modalidade</label>
                    <select 
                      className="form-control" 
                      value={returnType} 
                      onChange={(e) => setReturnType(e.target.value as 'Presencial' | 'Online')}
                    >
                      <option value="Presencial">Presencial (Consultório Principal)</option>
                      <option value="Online">Online (Videochamada Integrada)</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-teal" style={{ width: 'auto', alignSelf: 'flex-start' }}>
                    Confirmar Agendamento e Gerar Fatura
                  </button>
                </form>

                <h3 style={{ marginTop: '24px', marginBottom: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>Histórico de Consultas</h3>
                {patientAppointments.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Nenhum atendimento registrado anteriormente.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {patientAppointments.map(ap => (
                      <div 
                        key={ap.id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          backgroundColor: 'rgba(0,0,0,0.1)', 
                          padding: '10px 14px', 
                          borderRadius: '6px', 
                          border: '1px solid rgba(255,255,255,0.02)',
                          fontSize: '13px'
                        }}
                      >
                        <div>
                          <strong>{ap.date.split('-').reverse().join('/')}</strong> às {ap.time} - {ap.type}
                        </div>
                        <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>{ap.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Anthropometria Modal — Expandida */}
      <Modal 
        isOpen={showAntropometriaModal} 
        onClose={() => { setShowAntropometriaModal(false); setAntroTab('basico'); }}
        title="📊 Adicionar Dados Antropométricos"
      >
        {/* Abas internas do modal */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
          {[
            { id: 'basico', label: '🧘 Básico' },
            { id: 'circunferencias', label: '📌 Circunferências' },
            { id: 'dobras', label: '✌️ Dobras Cutâneas' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setAntroTab(t.id as AntroTab)}
              style={{
                padding: '5px 12px',
                fontSize: '12px',
                borderRadius: '20px',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: antroTab === t.id ? 'var(--primary-teal)' : 'transparent',
                borderColor: antroTab === t.id ? 'var(--primary-teal)' : 'rgba(255,255,255,0.1)',
                color: antroTab === t.id ? '#fff' : 'var(--text-secondary)',
                fontWeight: antroTab === t.id ? '600' : '400'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ABA: BÁSICO */}
        {antroTab === 'basico' && (
          <form onSubmit={(e) => {
            e.preventDefault();
            const w = parseFloat(weight);
            const h = parseFloat(height);
            if (!w || !h) { alert('Por favor, preencha peso e altura.'); return; }
            const bmi = (w / (h * h)).toFixed(1);
            const newEntry: AnthropometryEntry = {
              id: Date.now().toString(),
              date: new Date().toLocaleDateString('pt-BR'),
              weight,
              height,
              bf: bfPercentage || 'Não informada',
              bmi,
              circunferencias: {
                cintura: circWaist, quadril: circHip, abdomen: circAbdomen,
                braco: circArm, antebraco: circForearm, coxa: circThigh,
                panturrilha: circCalf, pescoco: circNeck, torax: circChest
              },
              dobras: {
                peitoral: sfChest, subescapular: sfSubscapular, triceps: sfTriceps,
                axilarMeio: sfAxillarMid, suprailiaca: sfSuprailiac, abdominal: sfAbdomen, coxa: sfThigh
              }
            };
            setAntropometriaHistory(prev => [newEntry, ...prev]);
            setShowAntropometriaModal(false);
            setAntroTab('basico');
            setWeight(''); setHeight(''); setBfPercentage('');
            alert('Dados antropométricos registrados com sucesso!');
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                { label: 'Peso (kg)', val: weight, set: setWeight, step: '0.1', ph: 'Ex: 70.5', req: true },
                { label: 'Altura (m)', val: height, set: setHeight, step: '0.01', ph: 'Ex: 1.70', req: true },
                { label: 'Gordura Corporal - BF (%)', val: bfPercentage, set: setBfPercentage, step: '0.1', ph: 'Ex: 22.5' },
              ].map(f => (
                <div key={f.label} className="form-group">
                  <label style={{ fontSize: '12px' }}>{f.label}</label>
                  <input
                    type="number" step={f.step} placeholder={f.ph}
                    className="form-control" value={f.val}
                    onChange={e => f.set(e.target.value)}
                    required={!!f.req}
                  />
                </div>
              ))}
            </div>
            {weight && height && (
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--primary-teal-light)', border: '1px solid var(--primary-teal-border)', borderRadius: '6px', fontSize: '13px', marginBottom: '14px' }}>
                <strong>IMC Calculado:</strong> {(parseFloat(weight) / (parseFloat(height) * parseFloat(height))).toFixed(1)} kg/m²
                {(() => {
                  const bmi = parseFloat(weight) / (parseFloat(height) * parseFloat(height));
                  const cat = bmi < 18.5 ? 'Abaixo do peso' : bmi < 25 ? '✅ Eutrofia (Normal)' : bmi < 30 ? '⚠️ Sobrepeso' : '🚨 Obesidade';
                  return <span style={{ marginLeft: '10px', fontWeight: '600' }}>— {cat}</span>;
                })()}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button type="button" className="btn-teal" style={{ backgroundColor: 'transparent', border: '1px solid var(--primary-teal)', color: 'var(--primary-teal)' }} onClick={() => setAntroTab('circunferencias')}>
                Próximo: Circunferências →
              </button>
              <button type="submit" className="btn-teal">Salvar Apenas Básico</button>
            </div>
          </form>
        )}

        {/* ABA: CIRCUNFERÊNCIAS */}
        {antroTab === 'circunferencias' && (
          <div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}
            >Registre as circunferências em <strong>centímetros (cm)</strong>. Campos opcionais.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Cintura (cm)', val: circWaist, set: setCircWaist, ph: 'Ex: 80' },
                { label: 'Quadril (cm)', val: circHip, set: setCircHip, ph: 'Ex: 100' },
                { label: 'Abdômen (cm)', val: circAbdomen, set: setCircAbdomen, ph: 'Ex: 90' },
                { label: 'Braço Relaxado (cm)', val: circArm, set: setCircArm, ph: 'Ex: 30' },
                { label: 'Antebraço (cm)', val: circForearm, set: setCircForearm, ph: 'Ex: 25' },
                { label: 'Coxa Medial (cm)', val: circThigh, set: setCircThigh, ph: 'Ex: 55' },
                { label: 'Panturrilha (cm)', val: circCalf, set: setCircCalf, ph: 'Ex: 38' },
                { label: 'Pescoço (cm)', val: circNeck, set: setCircNeck, ph: 'Ex: 35' },
                { label: 'Tórax / Peitoral (cm)', val: circChest, set: setCircChest, ph: 'Ex: 90' },
              ].map(f => (
                <div key={f.label} className="form-group">
                  <label style={{ fontSize: '12px' }}>{f.label}</label>
                  <input type="number" step="0.1" placeholder={f.ph} className="form-control" value={f.val} onChange={e => f.set(e.target.value)} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button type="button" className="btn-teal" style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }} onClick={() => setAntroTab('basico')}>
                ← Básico
              </button>
              <button type="button" className="btn-teal" onClick={() => setAntroTab('dobras')}>
                Próximo: Dobras Cutâneas →
              </button>
            </div>
          </div>
        )}

        {/* ABA: DOBRAS CUTÂNEAS */}
        {antroTab === 'dobras' && (
          <div>
            <div style={{ padding: '10px 14px', backgroundColor: 'rgba(250,190,60,0.06)', border: '1px solid rgba(250,190,60,0.2)', borderRadius: '6px', fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              ⏳ <strong>Aguardando:</strong> Os campos exatos de dobras cutâneas serão confirmados com a Amanda. Por ora, o padrão Pollock 7 Dobras está disponível.
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}
            >Registre as dobras em <strong>milímetros (mm)</strong> com o adipomêtro. Campos opcionais.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Peitoral (mm)', val: sfChest, set: setSfChest, ph: 'Ex: 12' },
                { label: 'Subescapular (mm)', val: sfSubscapular, set: setSfSubscapular, ph: 'Ex: 14' },
                { label: 'Tríceps (mm)', val: sfTriceps, set: setSfTriceps, ph: 'Ex: 18' },
                { label: 'Axilar Média (mm)', val: sfAxillarMid, set: setSfAxillarMid, ph: 'Ex: 10' },
                { label: 'Suprailiíaca (mm)', val: sfSuprailiac, set: setSfSuprailiac, ph: 'Ex: 16' },
                { label: 'Abdominal (mm)', val: sfAbdomen, set: setSfAbdomen, ph: 'Ex: 22' },
                { label: 'Coxa (mm)', val: sfThigh, set: setSfThigh, ph: 'Ex: 20' },
              ].map(f => (
                <div key={f.label} className="form-group">
                  <label style={{ fontSize: '12px' }}>{f.label}</label>
                  <input type="number" step="0.5" placeholder={f.ph} className="form-control" value={f.val} onChange={e => f.set(e.target.value)} />
                </div>
              ))}
            </div>
            {/* Soma das 7 dobras */}
            {[sfChest, sfSubscapular, sfTriceps, sfAxillarMid, sfSuprailiac, sfAbdomen, sfThigh].some(v => v) && (
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--primary-teal-light)', border: '1px solid var(--primary-teal-border)', borderRadius: '6px', fontSize: '13px', marginTop: '12px' }}>
                <strong>Soma das 7 Dobras (Pollock):</strong>{' '}
                {[sfChest, sfSubscapular, sfTriceps, sfAxillarMid, sfSuprailiac, sfAbdomen, sfThigh]
                  .reduce((acc, v) => acc + (parseFloat(v) || 0), 0).toFixed(1)} mm
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button type="button" className="btn-teal" style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }} onClick={() => setAntroTab('circunferencias')}>
                ← Circunferências
              </button>
              <button
                className="btn-teal"
                onClick={() => {
                  const w = parseFloat(weight);
                  const h = parseFloat(height);
                  if (!w || !h) { alert('Preencha peso e altura na aba Básico antes de salvar.'); setAntroTab('basico'); return; }
                  const bmi = (w / (h * h)).toFixed(1);
                  const newEntry: AnthropometryEntry = {
                    id: Date.now().toString(),
                    date: new Date().toLocaleDateString('pt-BR'),
                    weight, height, bf: bfPercentage || 'Não informada', bmi,
                    circunferencias: { cintura: circWaist, quadril: circHip, abdomen: circAbdomen, braco: circArm, antebraco: circForearm, coxa: circThigh, panturrilha: circCalf, pescoco: circNeck, torax: circChest },
                    dobras: { peitoral: sfChest, subescapular: sfSubscapular, triceps: sfTriceps, axilarMeio: sfAxillarMid, suprailiaca: sfSuprailiac, abdominal: sfAbdomen, coxa: sfThigh }
                  };
                  setAntropometriaHistory(prev => [newEntry, ...prev]);
                  setShowAntropometriaModal(false);
                  setAntroTab('basico');
                  setWeight(''); setHeight(''); setBfPercentage('');
                  setCircWaist(''); setCircHip(''); setCircAbdomen(''); setCircArm(''); setCircForearm(''); setCircThigh(''); setCircCalf(''); setCircNeck(''); setCircChest('');
                  setSfChest(''); setSfSubscapular(''); setSfTriceps(''); setSfAxillarMid(''); setSfSuprailiac(''); setSfAbdomen(''); setSfThigh('');
                  alert('Dados antropométricos completos registrados com sucesso!');
                }}
              >
                ✅ Salvar Avaliação Completa
              </button>
            </div>
          </div>
        )}

        {/* Histórico Recente */}
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
          <h4 style={{ fontSize: '13px', marginBottom: '10px', color: 'var(--text-primary)' }}>Histórico de Avaliações</h4>
          {antropometriaHistory.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Nenhum registro anterior.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
              {antropometriaHistory.map(item => (
                <div key={item.id} style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '12.5px' }}>{item.date}</strong>
                    <span style={{ color: 'var(--text-teal)', fontWeight: '600', fontSize: '12.5px' }}>IMC: {item.bmi}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    <span>{item.weight} kg</span>
                    <span>{item.height} m</span>
                    <span>BF: {item.bf}%</span>
                    {item.circunferencias?.cintura && <span>Cintura: {item.circunferencias.cintura} cm</span>}
                    {item.circunferencias?.quadril && <span>Quadril: {item.circunferencias.quadril} cm</span>}
                    {item.dobras?.triceps && <span>∑ Dobras: {[item.dobras.peitoral, item.dobras.subescapular, item.dobras.triceps, item.dobras.axilarMeio, item.dobras.suprailiaca, item.dobras.abdominal, item.dobras.coxa].reduce((a, v) => a + (parseFloat(v || '') || 0), 0).toFixed(1)} mm</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PatientProfile;
