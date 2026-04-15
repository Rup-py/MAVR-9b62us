import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { userService } from '@/services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, WorkoutPlan, DietPlan } from '@/services/types';
import { VALID_PRODUCT_CODES } from '@/services/mockData';

interface UserContextType {
  user: UserProfile | null;
  workoutPlan: WorkoutPlan | null;
  dietPlan: DietPlan | null;
  role: string | null;
  isLoading: boolean;
  isOnboardingComplete: boolean;
  isUnlocked: boolean;
  productCode: string;
  trainerVerificationStatus: 'none' | 'pending' | 'verified' | 'rejected';
  setUser: (user: UserProfile) => void;
  setRole: (role: string) => void;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
  unlockWithCode: (code: string) => Promise<boolean>;
  setTrainerVerificationStatus: (status: 'none' | 'pending' | 'verified' | 'rejected') => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const UNLOCK_KEY = 'mavr_unlocked';
const CODE_KEY = 'mavr_product_code';
const TRAINER_VERIFY_KEY = 'mavr_trainer_verify_status';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [role, setRoleState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [productCode, setProductCode] = useState('');
  const [trainerVerificationStatus, setTrainerVerificationStatusState] = useState<'none' | 'pending' | 'verified' | 'rejected'>('none');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [done, savedRole, savedUser, wp, dp, unlocked, code, tvStatus] = await Promise.all([
        userService.isOnboardingComplete(),
        userService.getRole(),
        userService.getUser(),
        userService.getWorkoutPlan(),
        userService.getDietPlan(),
        AsyncStorage.getItem(UNLOCK_KEY),
        AsyncStorage.getItem(CODE_KEY),
        AsyncStorage.getItem(TRAINER_VERIFY_KEY),
      ]);
      setIsOnboardingComplete(done);
      setRoleState(savedRole);
      setUserState(savedUser);
      setWorkoutPlan(wp);
      setDietPlan(dp);
      setIsUnlocked(unlocked === 'true');
      setProductCode(code || '');
      setTrainerVerificationStatusState((tvStatus as any) || 'none');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const setUser = (u: UserProfile) => {
    setUserState(u);
    userService.saveUser(u);
  };

  const setRole = (r: string) => {
    setRoleState(r);
    userService.setRole(r);
  };

  const completeOnboarding = async (data: Partial<UserProfile>) => {
    await userService.saveUser(data as UserProfile);
    await userService.setOnboardingComplete();
    const saved = await userService.getUser();
    setUserState(saved);
    setIsOnboardingComplete(true);
  };

  const refreshUser = async () => {
    const saved = await userService.getUser();
    setUserState(saved);
  };

  const unlockWithCode = async (code: string): Promise<boolean> => {
    const trimmed = code.trim().toUpperCase();
    const validUpper = VALID_PRODUCT_CODES.map((c) => c.toUpperCase());
    if (validUpper.includes(trimmed)) {
      await AsyncStorage.setItem(UNLOCK_KEY, 'true');
      await AsyncStorage.setItem(CODE_KEY, trimmed);
      setIsUnlocked(true);
      setProductCode(trimmed);
      return true;
    }
    return false;
  };

  const setTrainerVerificationStatus = async (status: 'none' | 'pending' | 'verified' | 'rejected') => {
    setTrainerVerificationStatusState(status);
    await AsyncStorage.setItem(TRAINER_VERIFY_KEY, status);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        workoutPlan,
        dietPlan,
        role,
        isLoading,
        isOnboardingComplete,
        isUnlocked,
        productCode,
        trainerVerificationStatus,
        setUser,
        setRole,
        completeOnboarding,
        refreshUser,
        unlockWithCode,
        setTrainerVerificationStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
