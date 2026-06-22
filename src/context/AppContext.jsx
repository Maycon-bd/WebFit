import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation State
  // Can be 'dashboard', 'pacientes', 'agendamentos', 'diario', 'financeiro', 'estudos', 'marketing', 'ferramentas', 'chat', 'suporte'
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState(null); // For viewing patient profiles

  // 1. User Profile State
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('webfit_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Dra. Marina Silva',
      crn: 'CRN-3 12345/SP',
      email: 'marina.nutri@webfit.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      whatsapp: '5511999999999',
      isBlack: false // Upgradable to Black!
    };
  });

  // 2. Patients State (Matches dashboard list and docs)
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('webfit_patients');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: '1',
        name: 'Alaine Dos Santos Pereira',
        nickname: 'Alaine',
        cpf: '123.456.789-00',
        phone: '(11) 98765-4321',
        email: 'alaine.santos@email.com',
        gender: 'Feminino',
        birthDate: '1995-04-12',
        tags: ['Gestante', 'Bariátrica'],
        lastModified: '19/06/2026 - 11:01:25',
        notes: 'Paciente gestante em acompanhamento pós-bariátrica. Necessita de atenção especial à absorção de ferro e B12.',
        status: 'Ativo'
      },
      {
        id: '2',
        name: 'Raiza Manuelle Marmo Santos',
        nickname: 'Raiza',
        cpf: '234.567.890-11',
        phone: '(11) 98888-1111',
        email: 'raiza.marmo@email.com',
        gender: 'Feminino',
        birthDate: '1998-09-22',
        tags: ['Atleta', 'Hipertrofia'],
        lastModified: '19/06/2026 - 10:02:09',
        notes: 'Atleta de vôlei. Foco em ganho de massa magra e otimização de performance pré-treino.',
        status: 'Ativo'
      },
      {
        id: '3',
        name: 'Gabriely Martins De Souza',
        nickname: 'Gaby',
        cpf: '345.678.901-22',
        phone: '(11) 97777-2222',
        email: 'gabriely.martins@email.com',
        gender: 'Feminino',
        birthDate: '2001-01-30',
        tags: ['Vegetariana', 'Emagrecimento'],
        lastModified: '19/06/2026 - 09:00:22',
        notes: 'Transição para dieta plant-based. Foco em emagrecimento e controle de ansiedade.',
        status: 'Ativo'
      },
      {
        id: '4',
        name: 'Elisangela Torres Correa',
        nickname: 'Elis',
        cpf: '456.789.012-33',
        phone: '(11) 96666-3333',
        email: 'elis.torres@email.com',
        gender: 'Feminino',
        birthDate: '1987-11-05',
        tags: ['Diabetes', 'LowCarb'],
        lastModified: '19/06/2026 - 08:00:45',
        notes: 'Paciente com diabetes tipo 2. Foco em redução da hemoglobina glicada através de protocolo Low Carb.',
        status: 'Ativo'
      },
      {
        id: '5',
        name: 'Paulo Henrique Marcelino Batista',
        nickname: 'Paulo',
        cpf: '567.890.123-44',
        phone: '(11) 95555-4444',
        email: 'paulo.marcelino@email.com',
        gender: 'Masculino',
        birthDate: '1990-07-18',
        tags: ['Hipertensão', 'Reeducação'],
        lastModified: '18/06/2026 - 21:21:29',
        notes: 'Reeducação alimentar geral. Iniciando atividades físicas regulares. Hipertensão leve sob controle.',
        status: 'Ativo'
      },
      {
        id: '6',
        name: 'Alessandra De Souza Soares',
        nickname: 'Ale',
        cpf: '678.901.234-55',
        phone: '(11) 94444-5555',
        email: 'alessandra.soares@email.com',
        gender: 'Feminino',
        birthDate: '1993-02-14',
        tags: ['Definição', 'Funcional'],
        lastModified: '18/06/2026 - 18:30:00',
        notes: 'Paciente focada em definição muscular. Registra todas as refeições no diário alimentar com foto.',
        status: 'Ativo'
      }
    ];
  });

  // 3. Planner / Tasks State (Matches Seu planner widget)
  const [plannerTasks, setPlannerTasks] = useState(() => {
    const saved = localStorage.getItem('webfit_tasks');
    if (saved) return JSON.parse(saved);
    return [
      { id: 't1', date: '2026-06-19', text: 'Enviar relatório pós-consulta da Alaine', done: false },
      { id: 't2', date: '2026-06-19', text: 'Revisar cardápio da Raiza', done: false },
      { id: 't3', date: '2026-06-20', text: 'Entrar em contato com Elisangela', done: false }
    ];
  });

  // 4. Notifications State (Matches notificacoes_diario_alimentar.png list)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('webfit_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'n1',
        patientId: '6',
        patientName: 'Alessandra De Souza Soares',
        timestamp: '19/06/2026 - 14:35',
        action: 'registrou uma foto no diário alimentar.',
        // Pre-loaded food images (mocking real food prints)
        mealPhoto: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
        mealName: 'Almoço Saudável (Salada, Arroz Integral, Grelhado)',
        read: false
      },
      {
        id: 'n2',
        patientId: '6',
        patientName: 'Alessandra De Souza Soares',
        timestamp: '18/06/2026 - 20:06',
        action: 'registrou uma foto no diário alimentar.',
        mealPhoto: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&auto=format&fit=crop&q=80',
        mealName: 'Salada de Folhas com Salmão',
        read: false
      },
      {
        id: 'n3',
        patientId: '6',
        patientName: 'Alessandra De Souza Soares',
        timestamp: '18/06/2026 - 18:30',
        action: 'registrou uma foto no diário alimentar.',
        mealPhoto: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=120&auto=format&fit=crop&q=80',
        mealName: 'Prato Equilibrado (Purê de batata doce e frango)',
        read: false
      },
      {
        id: 'n4',
        patientId: '6',
        patientName: 'Alessandra De Souza Soares',
        timestamp: '18/06/2026 - 18:29',
        action: 'registrou uma foto no diário alimentar.',
        mealPhoto: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&auto=format&fit=crop&q=80',
        mealName: 'Panquecas de Aveia e Whey',
        read: false
      }
    ];
  });

  // 5. Prescriptions State (Matches Prescrições recentes widget)
  const [prescriptions, setPrescriptions] = useState(() => {
    const saved = localStorage.getItem('webfit_prescriptions');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'pr1', type: 'Cardápio Semanal', date: '19/06/2026', patientName: 'Alaine Dos Santos Pereira', patientId: '1' },
      { id: 'pr2', type: 'Cardápio Semanal', date: '19/06/2026', patientName: 'Gabriely Martins De Souza', patientId: '3' },
      { id: 'pr3', type: 'Cardápio Semanal', date: '18/06/2026', patientName: 'Paulo Henrique Marcelino Batista', patientId: '5' },
      { id: 'pr4', type: 'Cardápio Semanal', date: '18/06/2026', patientName: 'Alessandra De Souza Soares', patientId: '6' },
      { id: 'pr5', type: 'Cardápio Semanal', date: '12/06/2026', patientName: 'Elisangela Torres Correa', patientId: '4' }
    ];
  });

  // 6. Consultations Appointments (Used for agenda and statistics chart)
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('webfit_appointments');
    if (saved) return JSON.parse(saved);
    return [
      // 3 in Jul/25, 1 in Ago/25, 8 in Jun/26 (Matches graph in prints)
      { id: 'ap1', patientId: '1', patientName: 'Alaine Dos Santos Pereira', date: '2025-07-05', time: '10:00', type: 'Presencial', status: 'Realizada' },
      { id: 'ap2', patientId: '2', patientName: 'Raiza Manuelle Marmo Santos', date: '2025-07-12', time: '14:00', type: 'Presencial', status: 'Realizada' },
      { id: 'ap3', patientId: '3', patientName: 'Gabriely Martins De Souza', date: '2025-07-20', time: '16:00', type: 'Online', status: 'Realizada' },
      { id: 'ap4', patientId: '4', patientName: 'Elisangela Torres Correa', date: '2025-08-15', time: '09:00', type: 'Online', status: 'Realizada' },
      // Jun 2026 consultations
      { id: 'ap5', patientId: '1', patientName: 'Alaine Dos Santos Pereira', date: '2026-06-19', time: '11:00', type: 'Presencial', status: 'Realizada' },
      { id: 'ap6', patientId: '2', patientName: 'Raiza Manuelle Marmo Santos', date: '2026-06-19', time: '10:00', type: 'Presencial', status: 'Realizada' },
      { id: 'ap7', patientId: '3', patientName: 'Gabriely Martins De Souza', date: '2026-06-19', time: '09:00', type: 'Online', status: 'Realizada' },
      { id: 'ap8', patientId: '4', patientName: 'Elisangela Torres Correa', date: '2026-06-19', time: '08:00', type: 'Online', status: 'Realizada' },
      { id: 'ap9', patientId: '5', patientName: 'Paulo Henrique Marcelino Batista', date: '2026-06-18', time: '15:00', type: 'Presencial', status: 'Realizada' },
      { id: 'ap10', patientId: '6', patientName: 'Alessandra De Souza Soares', date: '2026-06-18', time: '16:30', type: 'Presencial', status: 'Realizada' },
      { id: 'ap11', patientId: '2', patientName: 'Raiza Manuelle Marmo Santos', date: '2026-06-10', time: '14:00', type: 'Presencial', status: 'Realizada' },
      { id: 'ap12', patientId: '3', patientName: 'Gabriely Martins De Souza', date: '2026-06-12', time: '11:30', type: 'Online', status: 'Realizada' }
    ];
  });

  // 7. Financial Transactions (Financeiro menu)
  const [financials, setFinancials] = useState(() => {
    const saved = localStorage.getItem('webfit_financials');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'f1', patientName: 'Alaine Dos Santos Pereira', date: '19/06/2026', value: 250.00, method: 'PIX', status: 'Pago' },
      { id: 'f2', patientName: 'Raiza Manuelle Marmo Santos', date: '19/06/2026', value: 300.00, method: 'Cartão', status: 'Pago' },
      { id: 'f3', patientName: 'Gabriely Martins De Souza', date: '19/06/2026', value: 250.00, method: 'PIX', status: 'Pago' },
      { id: 'f4', patientName: 'Elisangela Torres Correa', date: '19/06/2026', value: 250.00, method: 'PIX', status: 'Pago' },
      { id: 'f5', patientName: 'Paulo Henrique Marcelino Batista', date: '18/06/2026', value: 250.00, method: 'Dinheiro', status: 'Pago' },
      { id: 'f6', patientName: 'Alessandra De Souza Soares', date: '18/06/2026', value: 300.00, method: 'PIX', status: 'Pago' }
    ];
  });

  // 8. Chat histories
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('webfit_chats');
    if (saved) return JSON.parse(saved);
    return {
      '1': [
        { sender: 'patient', text: 'Olá Dra! Já baixei o app.', time: '19/06/2026 - 11:15' },
        { sender: 'doctor', text: 'Olá Alaine! Ótimo. Dê uma olhada na sua prescrição semanal e qualquer dúvida me fale.', time: '19/06/2026 - 11:20' }
      ],
      '6': [
        { sender: 'patient', text: 'Dra, enviei a foto do meu almoço no diário.', time: '19/06/2026 - 14:40' },
        { sender: 'doctor', text: 'Oi Alessandra! Já visualizei nas notificações. O prato ficou excelente e super colorido, parabéns!', time: '19/06/2026 - 14:45' }
      ]
    };
  });

  // 9. Recipes
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('webfit_recipes');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'r1', title: 'Panqueca Fit de Banana', ingredients: '1 banana madura, 1 ovo, 2 colheres de sopa de farelo de aveia, canela a gosto.', method: 'Amasse a banana, misture com o ovo e farelo de aveia. Asse em frigideira antiaderente dos dois lados.', calories: 220 },
      { id: 'r2', title: 'Pão de Queijo de Frigideira', ingredients: '1 ovo, 1 colher de sopa de tapioca, 1 colher de sopa de requeijão light, 1 colher de sopa de queijo ralado.', method: 'Misture bem todos os ingredientes e asse na frigideira untada. Tampe para derreter.', calories: 180 },
      { id: 'r3', title: 'Suco Verde Antioxidante', ingredients: '2 folhas de couve, suco de 1 limão, 1 rodela de gengibre, 200ml de água de coco.', method: 'Bata tudo no liquidificador com gelo e consuma imediatamente sem coar.', calories: 95 }
    ];
  });

  // 10. My Custom Foods
  const [myFoods, setMyFoods] = useState(() => {
    const saved = localStorage.getItem('webfit_myfoods');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'fd1', name: 'Iogurte Natural de Ovelha', portion: '100g', calories: 75, protein: 5.5, carbs: 4.0, fat: 3.8 },
      { id: 'fd2', name: 'Pão de Fermentação Natural (Levain)', portion: '50g (1 fatia)', calories: 130, protein: 4.2, carbs: 26.0, fat: 0.8 },
      { id: 'fd3', name: 'Whey Protein Isolado Grass-Fed', portion: '30g (1 scoop)', calories: 110, protein: 26.0, carbs: 1.0, fat: 0.2 }
    ];
  });

  // 11. Message Templates (Marketing / Chat)
  const [messageTemplates, setMessageTemplates] = useState(() => {
    const saved = localStorage.getItem('webfit_templates');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'mt1', title: 'Boas-vindas ao consultório', content: 'Olá {nome}, fico muito feliz em acompanhar você na sua jornada! Lembre-se de baixar o nosso aplicativo e cadastrar suas fotos no Diário Alimentar. Qualquer dúvida, estou à disposição por aqui.' },
      { id: 'mt2', title: 'Lembrete de retorno', content: 'Olá {nome}, espero que esteja indo tudo bem com o plano alimentar! Já faz um tempo que nos vimos. Vamos agendar nosso retorno para ajustar as metas?' },
      { id: 'mt3', title: 'Instruções de pré-consulta', content: 'Olá {nome}, sua consulta está agendada! Para otimizar nosso tempo, peço que acesse o link de pré-consulta no sistema e preencha o questionário de hábitos.' }
    ];
  });

  // 12. App Settings Widget Content
  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('webfit_app_settings');
    return saved ? JSON.parse(saved) : {
      allowDiarioPhotos: true,
      allowWaterTracking: true,
      allowWeightLogging: true,
      diarioReminderInterval: '3' // hours
    };
  });

  // 13. Site Creator Content (Marketing)
  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('webfit_site_settings');
    return saved ? JSON.parse(saved) : {
      title: 'Marina Silva Nutrição Personalizada',
      bio: 'Nutricionista clínica com foco em emagrecimento saudável, gestantes e nutrição esportiva. Agende sua consulta!',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      phone: '(11) 98765-4321',
      theme: 'teal'
    };
  });

  // Save states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('webfit_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('webfit_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('webfit_tasks', JSON.stringify(plannerTasks));
  }, [plannerTasks]);

  useEffect(() => {
    localStorage.setItem('webfit_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('webfit_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('webfit_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('webfit_financials', JSON.stringify(financials));
  }, [financials]);

  useEffect(() => {
    localStorage.setItem('webfit_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('webfit_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('webfit_myfoods', JSON.stringify(myFoods));
  }, [myFoods]);

  useEffect(() => {
    localStorage.setItem('webfit_templates', JSON.stringify(messageTemplates));
  }, [messageTemplates]);

  useEffect(() => {
    localStorage.setItem('webfit_app_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  useEffect(() => {
    localStorage.setItem('webfit_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  // --- ACTIONS ---

  // Upgrade user to Webdiet Black
  const toggleBlackStatus = () => {
    setUserProfile(prev => ({
      ...prev,
      isBlack: !prev.isBlack
    }));
  };

  // Add Patient
  const addPatient = (patientData) => {
    const id = Date.now().toString();
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const newPatient = {
      id,
      name: patientData.name,
      nickname: patientData.nickname || patientData.name.split(' ')[0],
      cpf: patientData.cpf || 'Não informado',
      phone: patientData.phone || 'Não informado',
      email: patientData.email || 'Não informado',
      gender: patientData.gender || 'Feminino',
      birthDate: patientData.birthDate || '',
      tags: patientData.tags || [],
      lastModified: formattedDate,
      notes: patientData.notes || '',
      status: 'Ativo'
    };

    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  // Update Patient
  const updatePatient = (updated) => {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    setPatients(prev => prev.map(p => {
      if (p.id === updated.id) {
        return { ...p, ...updated, lastModified: formattedDate };
      }
      return p;
    }));
  };

  // Delete Patient (moves to logical delete or filter)
  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  // Add Planner Task
  const addPlannerTask = (text, dateStr) => {
    const newTask = {
      id: Date.now().toString(),
      date: dateStr,
      text,
      done: false
    };
    setPlannerTasks(prev => [...prev, newTask]);
  };

  // Toggle Planner Task Status
  const togglePlannerTask = (taskId) => {
    setPlannerTasks(prev => prev.map(t => {
      if (t.id === taskId) return { ...t, done: !t.done };
      return t;
    }));
  };

  // Add Prescription
  const addPrescription = (type, patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    
    const newPrescription = {
      id: Date.now().toString(),
      type,
      date: formattedDate,
      patientName: patient.name,
      patientId: patient.id
    };

    setPrescriptions(prev => [newPrescription, ...prev]);
    
    // Update patient modification date
    updatePatient({ id: patientId });
  };

  // Add Appointment
  const addAppointment = (appointmentData) => {
    const patient = patients.find(p => p.id === appointmentData.patientId);
    if (!patient) return;

    const newAppointment = {
      id: Date.now().toString(),
      patientId: patient.id,
      patientName: patient.name,
      date: appointmentData.date,
      time: appointmentData.time,
      type: appointmentData.type || 'Presencial',
      status: 'Confirmada'
    };

    setAppointments(prev => [newAppointment, ...prev]);
  };

  // Cancel Appointment
  const cancelAppointment = (appointmentId) => {
    setAppointments(prev => prev.filter(ap => ap.id !== appointmentId));
  };

  // Add Financial Transaction
  const addTransaction = (patientId, value, method) => {
    const patient = patients.find(p => p.id === patientId);
    const name = patient ? patient.name : 'Cliente Avulso';
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const newTransaction = {
      id: Date.now().toString(),
      patientName: name,
      date: formattedDate,
      value: parseFloat(value),
      method,
      status: 'Pago'
    };

    setFinancials(prev => [newTransaction, ...prev]);
  };

  // Send Chat Message
  const sendChatMessage = (patientId, text, sender = 'doctor') => {
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newMsg = { sender, text, time: timeStr };
    
    setChats(prev => {
      const patientChat = prev[patientId] ? [...prev[patientId], newMsg] : [newMsg];
      return { ...prev, [patientId]: patientChat };
    });
  };

  // Add Notification (simulate meal photo upload)
  const simulateMealUpload = (patientId, mealName, imageUrl) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const now = new Date();
    const timestampStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newNotification = {
      id: Date.now().toString(),
      patientId: patient.id,
      patientName: patient.name,
      timestamp: timestampStr,
      action: 'registrou uma foto no diário alimentar.',
      mealPhoto: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
      mealName: mealName || 'Refeição registrada',
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  // Clear unread count or read individual notification
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) return { ...n, read: true };
      return n;
    }));
  };

  return (
    <AppContext.Provider value={{
      activePage,
      setActivePage,
      selectedPatientId,
      setSelectedPatientId,
      userProfile,
      setUserProfile,
      patients,
      addPatient,
      updatePatient,
      deletePatient,
      plannerTasks,
      addPlannerTask,
      togglePlannerTask,
      notifications,
      markNotificationRead,
      simulateMealUpload,
      prescriptions,
      addPrescription,
      appointments,
      addAppointment,
      cancelAppointment,
      financials,
      addTransaction,
      chats,
      sendChatMessage,
      recipes,
      setRecipes,
      myFoods,
      setMyFoods,
      messageTemplates,
      setMessageTemplates,
      appSettings,
      setAppSettings,
      siteSettings,
      setSiteSettings,
      toggleBlackStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};
