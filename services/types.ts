export interface UserProfile {
  id: string;
  name: string;
  role: 'individual' | 'trainer' | 'student' | 'partner';
  age: number;
  city: string;
  height: number;
  weight: number;
  targetWeight: number;
  goal: string;
  trainingAge: number;
  workoutFrequency: number;
  gymType: string;
  dietPreference: string;
  tier: string;
  rank: string;
  points: number;
  streak: number;
  adherenceScore: number;
  connectedTrainer: TrainerProfile | null;
  avatar: string;
  badges: string[];
  createdAt: Date;
}

export interface TrainerProfile {
  id: string;
  name: string;
  displayName: string;
  city: string;
  specialization: string;
  experience: number;
  coachingType: string;
  mavrSignature: string;
  tier: string;
  studentCount: number;
  rating: number;
  bio: string;
  pricingMonthly: number;
  avatar: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  load: string;
  rest: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  estimatedDuration: number;
  intensity: 'Low' | 'Medium' | 'High' | 'Max';
}

export interface WorkoutPlan {
  id: string;
  assignedBy: 'ai' | 'trainer' | 'custom';
  trainerName: string | null;
  split: string;
  today: WorkoutDay;
}

export interface Meal {
  time: string;
  label: string;
  items: string[];
  calories: number;
  protein: number;
}

export interface DietPlan {
  id: string;
  assignedBy: 'ai' | 'trainer' | 'custom';
  trainerName: string | null;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: Meal[];
}

export interface CheckIn {
  id: string;
  date: string;
  morning: {
    completed: boolean;
    sleep?: number;
    weight?: number;
    mood?: string;
    energy?: number;
  };
  workout: {
    completed: boolean;
    exercisesDone?: number;
    sessionRating?: number;
  };
  night: {
    completed: boolean;
    dietFollowed?: boolean;
    proteinHit?: boolean;
    hydrationHit?: boolean;
  };
}

export interface Student {
  id: string;
  name: string;
  age: number;
  city: string;
  goal: string;
  adherenceScore: number;
  streak: number;
  lastCheckIn: string;
  paymentStatus: 'paid' | 'overdue' | 'pending';
  nextPaymentDue: string;
  tier: string;
  avatar: string;
  workoutPlanAssigned: boolean;
  dietPlanAssigned: boolean;
}
