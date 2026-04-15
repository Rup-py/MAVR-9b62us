export const APP_NAME = 'MAVR';
export const APP_TAGLINE = 'Athlete Operating System';

export const MAVR_SIGNATURE_EXAMPLES = ['MAVR-77RED', 'MAVR-12CORE', 'MAVR-X91PROT'];

export const ATHLETE_TIERS = [
  { id: 'starter', label: 'STARTER', color: '#666666', minPoints: 0 },
  { id: 'core', label: 'CORE', color: '#888888', minPoints: 500 },
  { id: 'redline', label: 'REDLINE', color: '#CC0000', minPoints: 1500 },
  { id: 'ascend', label: 'ASCEND', color: '#FF4444', minPoints: 3000 },
  { id: 'elite', label: 'ELITE', color: '#FFD700', minPoints: 6000 },
];

export const TRAINER_TIERS = [
  { id: 'coach', label: 'COACH', color: '#666666' },
  { id: 'pro_coach', label: 'PRO COACH', color: '#888888' },
  { id: 'signature_coach', label: 'SIGNATURE COACH', color: '#CC0000' },
  { id: 'elite_mentor', label: 'ELITE MENTOR', color: '#FFD700' },
];

export const PERFORMANCE_TAGS = [
  'Consistent',
  'Discipline Locked',
  'Precision Builder',
  'Recovery Strong',
  'Event Ready',
];

export const ROLE_OPTIONS = [
  {
    id: 'individual',
    label: 'Individual',
    subtitle: 'Personal training with AI-powered plans',
    icon: 'person',
  },
  {
    id: 'trainer',
    label: 'Trainer',
    subtitle: 'Register and manage your student roster',
    icon: 'fitness-center',
  },
  {
    id: 'student',
    label: 'Student',
    subtitle: 'Connect to your trainer via MAVR Signature',
    icon: 'school',
  },
  {
    id: 'partner',
    label: 'Gym Partner Focus',
    subtitle: 'Find serious partners by goal and timing',
    icon: 'group',
  },
];

export const GOALS = [
  'Muscle Gain',
  'Fat Loss',
  'Recomposition',
  'Strength',
  'Athletic Performance',
  'Endurance',
  'Flexibility & Mobility',
  'Event Prep',
];

export const DIET_PREFERENCES = [
  'Vegetarian',
  'Non-Vegetarian',
  'Vegan',
  'Eggetarian',
  'Keto',
  'High Protein',
];

export const EQUIPMENT_OPTIONS = [
  'Full Gym',
  'Home Basic',
  'Dumbbells Only',
  'Barbell + Rack',
  'Resistance Bands',
  'Bodyweight Only',
  'Cables + Machines',
];

export const MOCK_TRAINER_CODE = 'MAVR-77RED';
