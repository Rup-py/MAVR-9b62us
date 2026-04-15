import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USER, MOCK_TRAINER, MOCK_WORKOUT_PLAN, MOCK_DIET_PLAN, generateMAVRSignature } from './mockData';
import type { UserProfile, TrainerProfile, WorkoutPlan, DietPlan } from './types';

const KEYS = {
  USER: '@mavr_user',
  TRAINER: '@mavr_trainer',
  ONBOARDING_DONE: '@mavr_onboarding',
  ROLE: '@mavr_role',
  WORKOUT_PLAN: '@mavr_workout',
  DIET_PLAN: '@mavr_diet',
  CHECKIN: '@mavr_checkin',
};

export const userService = {
  async isOnboardingComplete(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
      return val === 'true';
    } catch {
      return false;
    }
  },

  async setOnboardingComplete(): Promise<void> {
    await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
  },

  async getRole(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.ROLE);
    } catch {
      return null;
    }
  },

  async setRole(role: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.ROLE, role);
  },

  async getUser(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER);
      if (data) return JSON.parse(data);
      return MOCK_USER;
    } catch {
      return MOCK_USER;
    }
  },

  async saveUser(user: Partial<UserProfile>): Promise<void> {
    const current = await this.getUser();
    const updated = { ...current, ...user };
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(updated));
  },

  async getTrainer(): Promise<TrainerProfile | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.TRAINER);
      if (data) return JSON.parse(data);
      return null;
    } catch {
      return null;
    }
  },

  async saveTrainer(trainer: Partial<TrainerProfile>): Promise<void> {
    const signature = generateMAVRSignature();
    const full = { ...MOCK_TRAINER, ...trainer, mavrSignature: signature };
    await AsyncStorage.setItem(KEYS.TRAINER, JSON.stringify(full));
  },

  async getWorkoutPlan(): Promise<WorkoutPlan> {
    try {
      const data = await AsyncStorage.getItem(KEYS.WORKOUT_PLAN);
      if (data) return JSON.parse(data);
      return MOCK_WORKOUT_PLAN;
    } catch {
      return MOCK_WORKOUT_PLAN;
    }
  },

  async getDietPlan(): Promise<DietPlan> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DIET_PLAN);
      if (data) return JSON.parse(data);
      return MOCK_DIET_PLAN;
    } catch {
      return MOCK_DIET_PLAN;
    }
  },

  async connectToTrainer(code: string): Promise<{ success: boolean; trainer?: TrainerProfile }> {
    // Mock: MAVR-77RED connects to mock trainer
    if (code.toUpperCase() === 'MAVR-77RED') {
      const { MOCK_TRAINER: trainer } = require('./mockData');
      await userService.saveUser({ connectedTrainer: trainer });
      return { success: true, trainer };
    }
    return { success: false };
  },

  async resetApp(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },
};
