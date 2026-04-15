import type { UserProfile, TrainerProfile, WorkoutPlan, DietPlan } from './types';

// ── Product Code System ───────────────────────────────────────────────────────
export const VALID_PRODUCT_CODES = [
  'MAVR-ALPHA-2026',
  'MAVR-ELITE-X1',
  'MAVR-REDLINE-01',
  'MAVR-CORE-2026',
  'MAVR-UNLOCK-PRO',
  'TESTCODE123',
];

export const MOCK_USER: UserProfile = {
  id: 'user_001',
  name: 'Arjun Mehta',
  role: 'individual',
  age: 24,
  city: 'Mumbai',
  height: 178,
  weight: 78,
  targetWeight: 82,
  goal: 'Muscle Gain',
  trainingAge: 2,
  workoutFrequency: 5,
  gymType: 'Gym',
  dietPreference: 'Non-Vegetarian',
  tier: 'redline',
  rank: 'REDLINE',
  points: 2340,
  streak: 18,
  adherenceScore: 87,
  connectedTrainer: null,
  avatar: 'A',
  badges: ['Consistent', 'Discipline Locked'],
  createdAt: new Date('2024-01-15'),
};

export const MOCK_TRAINER: TrainerProfile = {
  id: 'trainer_001',
  name: 'Coach Vikram Nair',
  displayName: 'Vikram Nair',
  city: 'Mumbai',
  specialization: 'Hypertrophy & Strength',
  experience: 7,
  coachingType: '1:1 & Online',
  mavrSignature: 'MAVR-77RED',
  tier: 'signature_coach',
  studentCount: 12,
  rating: 4.9,
  bio: 'Former national-level powerlifter. Specializing in hypertrophy protocols and event prep for competitive athletes.',
  pricingMonthly: 3500,
  avatar: 'V',
};

export const MOCK_WORKOUT_PLAN: WorkoutPlan = {
  id: 'wp_001',
  assignedBy: 'ai',
  trainerName: null,
  split: 'Push Pull Legs',
  today: {
    day: 'PUSH',
    focus: 'Chest, Shoulders, Triceps',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '6-8', load: '80kg', rest: '180s' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', load: '24kg', rest: '120s' },
      { name: 'Cable Fly', sets: 3, reps: '12-15', load: '15kg', rest: '90s' },
      { name: 'Overhead Press', sets: 4, reps: '8-10', load: '50kg', rest: '150s' },
      { name: 'Lateral Raises', sets: 3, reps: '15-20', load: '10kg', rest: '60s' },
      { name: 'Tricep Pushdown', sets: 3, reps: '12-15', load: '20kg', rest: '90s' },
    ],
    estimatedDuration: 70,
    intensity: 'High',
  },
};

export const MOCK_DIET_PLAN: DietPlan = {
  id: 'dp_001',
  assignedBy: 'ai',
  trainerName: null,
  targetCalories: 3200,
  targetProtein: 180,
  targetCarbs: 380,
  targetFat: 90,
  meals: [
    { time: '07:00', label: 'Pre-Workout', items: ['Oats 100g', 'Banana 1 large', 'Whey Protein 30g', 'Black Coffee'], calories: 520, protein: 38 },
    { time: '10:30', label: 'Post-Workout', items: ['Chicken Breast 200g', 'Brown Rice 150g', 'Vegetables', 'Creatine 5g'], calories: 680, protein: 52 },
    { time: '13:30', label: 'Lunch', items: ['Paneer 150g or Eggs 4', 'Dal 1 bowl', 'Chapati 2', 'Salad'], calories: 720, protein: 45 },
    { time: '17:00', label: 'Evening Snack', items: ['Greek Yogurt 200g', 'Mixed Nuts 30g'], calories: 310, protein: 22 },
    { time: '20:00', label: 'Dinner', items: ['Salmon or Chicken 200g', 'Sweet Potato 150g', 'Greens'], calories: 680, protein: 48 },
  ],
};

export const MOCK_STUDENTS = [
  {
    id: 's_001',
    name: 'Rahul Sharma',
    age: 22,
    city: 'Mumbai',
    goal: 'Muscle Gain',
    adherenceScore: 92,
    streak: 24,
    lastCheckIn: 'Today',
    paymentStatus: 'paid',
    nextPaymentDue: '15 May 2026',
    tier: 'core',
    avatar: 'R',
    workoutPlanAssigned: true,
    dietPlanAssigned: true,
    redlineScore: 92,
    setsLogged: 22,
    setsPlanned: 24,
    sleepHours: 7.5,
    sleepTarget: 8,
    nutritionAdherence: 94,
    trainingCompletion: 91,
    recoveryScore: 88,
    dailyTonnage: 14200,
    weeklyTonnage: [12400, 14800, 13200, 14200, 0, 0, 0],
    influence: 0,
    superpower: 'THE IRON HEART',
    intentMode: 'Vanguard',
    trainingAge: 3,
    feedbackGiven: true,
    feedbackRating: 5,
    feedbackText: 'Incredible coaching. Plans are structured and results visible in 3 weeks.',
    feedbackDate: '3 days ago',
  },
  {
    id: 's_002',
    name: 'Priya Kapoor',
    age: 26,
    city: 'Pune',
    goal: 'Fat Loss',
    adherenceScore: 78,
    streak: 11,
    lastCheckIn: 'Yesterday',
    paymentStatus: 'paid',
    nextPaymentDue: '20 May 2026',
    tier: 'starter',
    avatar: 'P',
    workoutPlanAssigned: true,
    dietPlanAssigned: false,
    redlineScore: 74,
    setsLogged: 14,
    setsPlanned: 18,
    sleepHours: 6.5,
    sleepTarget: 8,
    nutritionAdherence: 79,
    trainingCompletion: 77,
    recoveryScore: 65,
    dailyTonnage: 8600,
    weeklyTonnage: [7200, 8100, 8600, 0, 0, 0, 0],
    influence: 0,
    superpower: 'THE METABOLIC GHOST',
    intentMode: 'Shadow',
    trainingAge: 1,
    feedbackGiven: true,
    feedbackRating: 4,
    feedbackText: 'Diet plan pending but workout structure is solid.',
    feedbackDate: '1 week ago',
  },
  {
    id: 's_003',
    name: 'Aakash Patel',
    age: 28,
    city: 'Ahmedabad',
    goal: 'Strength',
    adherenceScore: 65,
    streak: 4,
    lastCheckIn: '3 days ago',
    paymentStatus: 'overdue',
    nextPaymentDue: '1 May 2026',
    tier: 'redline',
    avatar: 'A',
    workoutPlanAssigned: false,
    dietPlanAssigned: false,
    redlineScore: 61,
    setsLogged: 10,
    setsPlanned: 20,
    sleepHours: 5.5,
    sleepTarget: 8,
    nutritionAdherence: 60,
    trainingCompletion: 50,
    recoveryScore: 55,
    dailyTonnage: 11800,
    weeklyTonnage: [10200, 11800, 0, 0, 0, 0, 0],
    influence: 0,
    superpower: 'THE ENGINE',
    intentMode: 'Vanguard',
    trainingAge: 4,
    feedbackGiven: false,
    feedbackRating: 0,
    feedbackText: '',
    feedbackDate: '',
  },
];

export const MOCK_GYM_PARTNERS = [
  {
    id: 'gp_001',
    name: 'Dev Singh',
    age: 23,
    city: 'Mumbai',
    goal: 'Muscle Gain',
    timing: '6:00 - 8:00 AM',
    seriousness: 'Competitive',
    gymName: 'Fitness First, Andheri',
    tier: 'core',
    avatar: 'D',
    compatibility: 94,
    redlineScore: 89,
    trainingAge: 3,
    superpower: 'THE PRECISION BUILDER',
    intentMode: 'Vanguard',
    influence: 240,
    requestStatus: null as 'sent' | 'accepted' | 'pending' | null,
    online: true,
    sameGym: true,
  },
  {
    id: 'gp_002',
    name: 'Karan Malhotra',
    age: 25,
    city: 'Mumbai',
    goal: 'Strength',
    timing: '6:30 - 8:30 AM',
    seriousness: 'Serious',
    gymName: 'Gold Gym, Bandra',
    tier: 'redline',
    avatar: 'K',
    compatibility: 87,
    redlineScore: 83,
    trainingAge: 4,
    superpower: 'THE ENGINE',
    intentMode: 'Symmetry',
    influence: 180,
    requestStatus: null as 'sent' | 'accepted' | 'pending' | null,
    online: false,
    sameGym: false,
  },
  {
    id: 'gp_003',
    name: 'Nisha Verma',
    age: 24,
    city: 'Mumbai',
    goal: 'Fat Loss',
    timing: '7:00 - 9:00 AM',
    seriousness: 'Serious',
    gymName: 'Anytime Fitness, Powai',
    tier: 'starter',
    avatar: 'N',
    compatibility: 76,
    redlineScore: 71,
    trainingAge: 1,
    superpower: 'THE METABOLIC GHOST',
    intentMode: 'Shadow',
    influence: 0,
    requestStatus: 'pending' as 'sent' | 'accepted' | 'pending' | null,
    online: true,
    sameGym: false,
  },
];

// ── Mock Chat Messages ────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  gp_001: [
    { id: 'm1', senderId: 'gp_001', text: 'Bro are you at Fitness First today?', timestamp: '07:12 AM', isMe: false },
    { id: 'm2', senderId: 'me', text: 'Yes just arrived. Chest day today?', timestamp: '07:14 AM', isMe: true },
    { id: 'm3', senderId: 'gp_001', text: 'Same here. Let us spot each other on bench.', timestamp: '07:15 AM', isMe: false },
    { id: 'm4', senderId: 'me', text: 'Done. See you at the barbell rack.', timestamp: '07:16 AM', isMe: true },
  ],
  gp_003: [
    { id: 'm1', senderId: 'gp_003', text: 'Hi, I sent you a connect request. My goal is fat loss and I train at 7 AM.', timestamp: 'Yesterday', isMe: false },
  ],
};

// ── Partner Requests ──────────────────────────────────────────────────────────
export interface PartnerRequest {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerTier: string;
  partnerGoal: string;
  partnerTiming: string;
  partnerGym: string;
  compatibility: number;
  status: 'pending' | 'sent' | 'accepted';
  timestamp: string;
}

export const MOCK_PARTNER_REQUESTS: PartnerRequest[] = [
  {
    id: 'req_001',
    partnerId: 'gp_003',
    partnerName: 'Nisha Verma',
    partnerAvatar: 'N',
    partnerTier: 'starter',
    partnerGoal: 'Fat Loss',
    partnerTiming: '7:00 - 9:00 AM',
    partnerGym: 'Anytime Fitness, Powai',
    compatibility: 76,
    status: 'pending',
    timestamp: '2 hours ago',
  },
];

// ── Smartwatch / Bio data ─────────────────────────────────────────────────────
export const MOCK_BIOMETRICS = {
  heartRate: 72,
  hrv: 58,
  steps: 8420,
  stepGoal: 10000,
  caloriesBurned: 620,
  activeMinutes: 48,
  sleepHours: 7.2,
  sleepTarget: 8,
  sleepDebt: 0.8,
  stressLoad: 32,
  bloodOxygen: 98,
  restingHR: 62,
  connected: false,
};

export const computeRedlineScore = (nutrition: number, training: number, sleep: number, sleepTarget: number): number => {
  const recoveryRaw = Math.min(100, (sleep / sleepTarget) * 100);
  return Math.round((nutrition * 0.4) + (training * 0.4) + (recoveryRaw * 0.2));
};

export const MOCK_PR_RECORDS: Record<string, number> = {
  'Barbell Bench Press': 95,
  'Overhead Press': 60,
  'Barbell Squat': 120,
  'Deadlift': 150,
};

export const MOCK_VANGUARDS = [
  {
    id: 'v_001',
    name: 'Siddharth Rao',
    age: 30,
    tier: 'elite',
    avatar: 'S',
    superpower: 'THE SOVEREIGN',
    trainingAge: 8,
    influence: 1240,
    redlineScore: 97,
    gym: 'Gold Gym, Bandra',
    goal: 'Powerlifting',
    intentMode: 'Vanguard',
  },
  {
    id: 'v_002',
    name: 'Rohan Desai',
    age: 27,
    tier: 'ascend',
    avatar: 'R',
    superpower: 'THE ENGINE',
    trainingAge: 6,
    influence: 820,
    redlineScore: 94,
    gym: 'Fitness First, Andheri',
    goal: 'Hypertrophy',
    intentMode: 'Vanguard',
  },
];

// ── Trainer Feedback / Reviews ────────────────────────────────────────────────
export interface TrainerReview {
  id: string;
  studentName: string;
  studentAvatar: string;
  studentTier: string;
  rating: number;
  review: string;
  date: string;
  goal: string;
}

export const MOCK_TRAINER_REVIEWS: TrainerReview[] = [
  {
    id: 'rev_001',
    studentName: 'Rahul Sharma',
    studentAvatar: 'R',
    studentTier: 'core',
    rating: 5,
    review: 'Incredible coaching. Plans are structured and results visible in 3 weeks. Vikram sir understands the science.',
    date: '3 days ago',
    goal: 'Muscle Gain',
  },
  {
    id: 'rev_002',
    studentName: 'Priya Kapoor',
    studentAvatar: 'P',
    studentTier: 'starter',
    rating: 4,
    review: 'Workout plan is solid and the check-in system keeps me accountable. Waiting for diet plan.',
    date: '1 week ago',
    goal: 'Fat Loss',
  },
];

export const generateMAVRSignature = (): string => {
  const prefix = ['RED', 'CORE', 'PROT', 'FORCE', 'ELITE', 'APEX'][Math.floor(Math.random() * 6)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `MAVR-${num}${prefix}`;
};
