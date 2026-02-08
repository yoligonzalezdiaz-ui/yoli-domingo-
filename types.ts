
export enum Category {
  BAJO_IMPACTO = 'bajo impacto',
  ALTO_IMPACTO = 'alto impacto',
  FUNCIONAL = 'funcional',
  PISCINA = 'piscina',
  COREOGRAFICAS = 'coreograficas'
}

export interface ScheduledClass {
  id: string;
  name: string;
  instructor: string;
  room: string;
  day: string;
  hour: string;
  category: Category;
  capacity: number;
  booked: number;
}

export interface Booking {
  id: string;
  classId: string;
  timestamp: number;
  type: 'group' | 'pt';
  trainerId?: number;
  day?: string;
  hour?: string;
}

export interface RoutineActivity {
  title: string;
  description: string;
  type: 'machine' | 'cardio' | 'class' | 'free_weight' | 'rest';
  sets?: string;
  reps?: string;
  machineName?: string;
}

export interface RoutineDay {
  dayName: string;
  activities: RoutineActivity[];
  focus: string;
}

export interface RoutinePlan {
  planName: string;
  days: RoutineDay[];
}

export interface UserProfile {
  name: string;
  email: string;
  dni: string;
  plan: string;
  memberId: string;
  joinedAt: number;
  goal?: string;
  routine?: RoutinePlan;
}

export interface Trainer {
  id: number;
  name: string;
  role: string;
  image: string;
  specialties: string[];
  description: string;
}

export interface Center {
  id: string;
  name: string;
  address: string;
  description: string;
  mainImage: string;
  gallery: string[];
  features: string[];
  highlight: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FitnessGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
}
