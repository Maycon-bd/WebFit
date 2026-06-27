// ─────────────────────────────────────────────
// Core Domain Types — WebFit
// ─────────────────────────────────────────────

export interface Patient {
  id: string;
  name: string;
  nickname: string;
  cpf: string;
  phone: string;
  email: string;
  gender: 'Masculino' | 'Feminino' | string;
  birthDate: string;
  tags: string[];
  lastModified: string;
  notes: string;
  status: 'Ativo' | 'Inativo';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'Presencial' | 'Online';
  status: string;
}

export interface Financial {
  id: string;
  patientName: string;
  date: string;
  value: number;
  method: 'PIX' | 'Cartão' | 'Dinheiro' | string;
  status: string;
}

export interface Notification {
  id: string;
  patientId: string;
  patientName: string;
  timestamp: string;
  action: string;
  mealPhoto: string;
  mealName: string;
  read: boolean;
}

export interface PlannerTask {
  id: string;
  date: string;
  text: string;
  done: boolean;
}

export interface Prescription {
  id: string;
  type: string;
  date: string;
  patientName: string;
  patientId: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string;
  method: string;
  calories: number;
}

export interface Food {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserProfile {
  name: string;
  crn: string;
  email: string;
  avatar: string;
  whatsapp: string;
  isBlack: boolean;
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
}

export interface AppSettings {
  allowDiarioPhotos: boolean;
  allowWaterTracking: boolean;
  allowWeightLogging: boolean;
  diarioReminderInterval: string;
}

export interface SiteSettings {
  title: string;
  bio: string;
  address: string;
  phone: string;
  theme: string;
}

export interface AnthropometryCircumferences {
  cintura?: string;
  quadril?: string;
  abdomen?: string;
  braco?: string;
  antebraco?: string;
  coxa?: string;
  panturrilha?: string;
  pescoco?: string;
  torax?: string;
}

export interface AnthropometrySkinfolds {
  peitoral?: string;
  subescapular?: string;
  triceps?: string;
  axilarMeio?: string;
  suprailiaca?: string;
  abdominal?: string;
  coxa?: string;
}

export interface AnthropometryEntry {
  id: string;
  date: string;
  weight: string;
  height: string;
  bf: string;
  bmi: string;
  circunferencias?: AnthropometryCircumferences;
  dobras?: AnthropometrySkinfolds;
}

export type AppPage =
  | 'dashboard'
  | 'pacientes'
  | 'agendamentos'
  | 'diario'
  | 'financeiro'
  | 'estudos'
  | 'marketing'
  | 'ferramentas'
  | 'chat'
  | 'suporte';

export type AppTheme = 'midnight' | 'oled' | 'slate' | 'light';

// ─────────────────────────────────────────────
// AppContext Interface
// ─────────────────────────────────────────────

export interface Chat {
  [patientId: string]: ChatMessage[];
}

export interface ChatMessage {
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
}

export interface AppContextType {
  // Navigation
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  appTheme: AppTheme;
  setAppTheme: (theme: AppTheme) => void;

  // Triggers
  triggerPatientCreate: boolean;
  setTriggerPatientCreate: (v: boolean) => void;
  triggerAppointmentCreate: boolean;
  setTriggerAppointmentCreate: (v: boolean) => void;
  triggerFinancialsCreate: boolean;
  setTriggerFinancialsCreate: (v: boolean) => void;

  // Patient
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;

  // User Profile
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  toggleBlackStatus: () => void;

  // Patients
  patients: Patient[];
  addPatient: (data: Omit<Patient, 'id' | 'lastModified' | 'status'>) => Patient;
  updatePatient: (updated: Partial<Patient> & { id: string }) => void;
  deletePatient: (id: string) => void;

  // Planner
  plannerTasks: PlannerTask[];
  addPlannerTask: (text: string, dateStr: string) => void;
  togglePlannerTask: (taskId: string) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  simulateMealUpload: (patientId: string, mealName: string, imageUrl: string) => void;

  // Prescriptions
  prescriptions: Prescription[];
  addPrescription: (type: string, patientId: string) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (data: Omit<Appointment, 'id' | 'patientName' | 'status'>) => void;
  cancelAppointment: (id: string) => void;

  // Financials
  financials: Financial[];
  addTransaction: (patientId: string, value: number, method: string) => void;

  // Chat
  chats: Chat;
  sendChatMessage: (patientId: string, text: string, sender?: 'doctor' | 'patient') => void;

  // Recipes & Foods
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  myFoods: Food[];
  setMyFoods: React.Dispatch<React.SetStateAction<Food[]>>;

  // Templates & Settings
  messageTemplates: MessageTemplate[];
  setMessageTemplates: React.Dispatch<React.SetStateAction<MessageTemplate[]>>;
  appSettings: AppSettings;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
}
