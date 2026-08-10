import React, { createContext, useCallback, useState, useEffect } from 'react';
import type {
  AppContextType,
  AppPage,
  AppTheme,
  Patient,
  Appointment,
  Financial,
  Notification,
  PlannerTask,
  Prescription,
  Recipe,
  Food,
  UserProfile,
  MessageTemplate,
  AppSettings,
  SiteSettings,
  Chat,
} from '../types';
import { readStorage, readStringStorage, writeStorage } from '../services/storage';
import { useAuth } from './AuthContext';
import { useWorkspace } from './WorkspaceContext';
import {
  cancelAppointmentRecord,
  createAppointment,
  createPatient,
  deletePatientRecord,
  listAppointments,
  listPatients,
  updatePatientRecord,
} from '../services/clinicalRepository';

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { configured, user } = useAuth();
  const { activeClinic } = useWorkspace();
  // Navigation State
  const [activePage, setActivePage] = useState<AppPage>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    return readStringStorage<AppTheme>('webfit_theme', 'light');
  });

  // Action Triggers from Apps Grid dropdown
  const [triggerPatientCreate, setTriggerPatientCreate] = useState(false);
  const [triggerAppointmentCreate, setTriggerAppointmentCreate] = useState(false);
  const [triggerFinancialsCreate, setTriggerFinancialsCreate] = useState(false);

  // Perfil real do usuário autenticado; sem persona de demonstração.
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Profissional',
    crn: '',
    email: '',
    avatar: '',
    whatsapp: '',
    isBlack: false,
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // 3. Planner / Tasks State
  const [plannerTasks, setPlannerTasks] = useState<PlannerTask[]>([]);

  // 4. Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 5. Prescriptions State
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  // 6. Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // 7. Financial Transactions
  const [financials, setFinancials] = useState<Financial[]>([]);

  // 8. Chat histories
  const [chats, setChats] = useState<Chat>({});

  // 9. Recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // 10. My Custom Foods
  const [myFoods, setMyFoods] = useState<Food[]>([]);

  // 11. Message Templates
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([]);

  // 12. App Settings Widget Content
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = readStorage<AppSettings | null>('webfit_app_settings', null);
    return saved ?? {
      allowDiarioPhotos: true,
      allowWaterTracking: true,
      allowWeightLogging: true,
      diarioReminderInterval: '3'
    };
  });

  // 13. Site Creator Content (Marketing)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: '',
    bio: '',
    address: '',
    phone: '',
    theme: 'violet',
  });

  useEffect(() => {
    setUserProfile((current) => ({
      ...current,
      name: String(user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? 'Profissional'),
      email: user?.email ?? '',
      avatar: '',
    }));
  }, [user]);

  useEffect(() => {
    if (activeClinic) {
      setSiteSettings((current) => current.title ? current : { ...current, title: activeClinic.name });
    }
  }, [activeClinic]);

  const refreshClinicalData = useCallback(async () => {
    if (!configured || !activeClinic) {
      setPatients([]);
      setAppointments([]);
      setDataLoading(false);
      setDataError(null);
      return;
    }

    setDataLoading(true);
    setDataError(null);
    try {
      const nextPatients = await listPatients(activeClinic.id);
      const nextAppointments = await listAppointments(activeClinic.id, nextPatients);
      setPatients(nextPatients);
      setAppointments(nextAppointments);
    } catch (cause) {
      console.error('[WebFit dados clínicos] Falha ao carregar dados', cause);
      setDataError('Não foi possível carregar pacientes e agendamentos. Tente novamente.');
    } finally {
      setDataLoading(false);
    }
  }, [activeClinic, configured]);

  useEffect(() => {
    window.localStorage.removeItem('webfit_patients');
    window.localStorage.removeItem('webfit_appointments');
    void refreshClinicalData();
  }, [refreshClinicalData]);

  // ── Persist to localStorage ──────────────────────────────────
  useEffect(() => { writeStorage('webfit_theme', appTheme); }, [appTheme]);
  useEffect(() => { writeStorage('webfit_profile', userProfile); }, [userProfile]);
  useEffect(() => { writeStorage('webfit_tasks', plannerTasks); }, [plannerTasks]);
  useEffect(() => { writeStorage('webfit_notifications', notifications); }, [notifications]);
  useEffect(() => { writeStorage('webfit_prescriptions', prescriptions); }, [prescriptions]);
  useEffect(() => { writeStorage('webfit_financials', financials); }, [financials]);
  useEffect(() => { writeStorage('webfit_chats', chats); }, [chats]);
  useEffect(() => { writeStorage('webfit_recipes', recipes); }, [recipes]);
  useEffect(() => { writeStorage('webfit_myfoods', myFoods); }, [myFoods]);
  useEffect(() => { writeStorage('webfit_templates', messageTemplates); }, [messageTemplates]);
  useEffect(() => { writeStorage('webfit_app_settings', appSettings); }, [appSettings]);
  useEffect(() => { writeStorage('webfit_site_settings', siteSettings); }, [siteSettings]);

  // ── Actions ──────────────────────────────────────────────────

  const toggleBlackStatus = () => {
    setUserProfile(prev => ({ ...prev, isBlack: !prev.isBlack }));
  };

  const requireClinicalIdentity = () => {
    if (!activeClinic || !user) throw new Error('Sua sessão clínica não está pronta. Entre novamente e selecione a clínica.');
    return { clinicId: activeClinic.id, userId: user.id };
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'lastModified' | 'status'>): Promise<Patient> => {
    const { clinicId, userId } = requireClinicalIdentity();
    setDataError(null);
    const newPatient = await createPatient(clinicId, userId, patientData);
    setPatients((current) => [newPatient, ...current]);
    return newPatient;
  };

  const updatePatient = async (updated: Partial<Patient> & { id: string }): Promise<void> => {
    const { clinicId } = requireClinicalIdentity();
    setDataError(null);
    const savedPatient = await updatePatientRecord(clinicId, updated);
    setPatients((current) => current.map((patient) => patient.id === savedPatient.id ? savedPatient : patient));
    setAppointments((current) => current.map((appointment) => (
      appointment.patientId === savedPatient.id
        ? { ...appointment, patientName: savedPatient.name }
        : appointment
    )));
  };

  const deletePatient = async (id: string): Promise<void> => {
    const { clinicId } = requireClinicalIdentity();
    setDataError(null);
    await deletePatientRecord(clinicId, id);
    setPatients(prev => prev.filter(p => p.id !== id));
    setAppointments(prev => prev.filter(ap => ap.patientId !== id));
    setPrescriptions(prev => prev.filter(prescription => prescription.patientId !== id));
    setNotifications(prev => prev.filter(notification => notification.patientId !== id));
    setFinancials(prev => prev.filter(transaction => transaction.patientId !== id));
    setChats(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSelectedPatientId(prev => prev === id ? null : prev);
  };

  const addPlannerTask = (text: string, dateStr: string) => {
    const newTask: PlannerTask = { id: Date.now().toString(), date: dateStr, text, done: false };
    setPlannerTasks(prev => [...prev, newTask]);
  };

  const togglePlannerTask = (taskId: string) => {
    setPlannerTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: !t.done } : t));
  };

  const addPrescription = (type: string, patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const newPrescription: Prescription = {
      id: Date.now().toString(),
      type,
      date: formattedDate,
      patientName: patient.name,
      patientId: patient.id
    };

    setPrescriptions(prev => [newPrescription, ...prev]);
    void updatePatient({ id: patientId }).catch((cause) => {
      console.error('[WebFit paciente] Falha ao atualizar modificação', cause);
    });
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'patientName' | 'status'>): Promise<void> => {
    const patient = patients.find(p => p.id === appointmentData.patientId);
    if (!patient) throw new Error('Paciente não encontrado. Atualize a página e tente novamente.');
    const { clinicId, userId } = requireClinicalIdentity();
    setDataError(null);
    const newAppointment = await createAppointment(clinicId, userId, appointmentData, patient.name);
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const cancelAppointment = async (appointmentId: string): Promise<void> => {
    const { clinicId } = requireClinicalIdentity();
    setDataError(null);
    await cancelAppointmentRecord(clinicId, appointmentId);
    setAppointments(prev => prev.map(ap => ap.id === appointmentId ? { ...ap, status: 'Cancelada' } : ap));
  };

  const addTransaction = (patientId: string, value: number, method: string, customClientName = '') => {
    const patient = patients.find(p => p.id === patientId);
    const name = patient ? patient.name : customClientName.trim() || 'Cliente Avulso';
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const newTransaction: Financial = {
      id: Date.now().toString(),
      patientId: patient?.id,
      patientName: name,
      date: formattedDate,
      value,
      method,
      status: 'Pago'
    };

    setFinancials(prev => [newTransaction, ...prev]);
  };

  const sendChatMessage = (patientId: string, text: string, sender: 'doctor' | 'patient' = 'doctor') => {
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg = { sender, text, time: timeStr };

    setChats(prev => {
      const patientChat = prev[patientId] ? [...prev[patientId], newMsg] : [newMsg];
      return { ...prev, [patientId]: patientChat };
    });
  };

  const simulateMealUpload = (patientId: string, mealName: string, imageUrl: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const now = new Date();
    const timestampStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newNotification: Notification = {
      id: Date.now().toString(),
      patientId: patient.id,
      patientName: patient.name,
      timestamp: timestampStr,
      action: 'registrou uma foto no diário alimentar.',
      mealPhoto: imageUrl,
      mealName: mealName || 'Refeição registrada',
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      activePage, setActivePage,
      appTheme, setAppTheme,
      triggerPatientCreate, setTriggerPatientCreate,
      triggerAppointmentCreate, setTriggerAppointmentCreate,
      triggerFinancialsCreate, setTriggerFinancialsCreate,
      selectedPatientId, setSelectedPatientId,
      userProfile, setUserProfile,
      patients, dataLoading, dataError, refreshClinicalData, addPatient, updatePatient, deletePatient,
      plannerTasks, addPlannerTask, togglePlannerTask,
      notifications, markNotificationRead, simulateMealUpload,
      prescriptions, addPrescription,
      appointments, addAppointment, cancelAppointment,
      financials, addTransaction,
      chats, sendChatMessage,
      recipes, setRecipes,
      myFoods, setMyFoods,
      messageTemplates, setMessageTemplates,
      appSettings, setAppSettings,
      siteSettings, setSiteSettings,
      toggleBlackStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};
