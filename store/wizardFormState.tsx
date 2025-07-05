import { WizardStateType } from '@/types/wizard-form-type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useWizardStore = create<WizardStateType>()(
  persist(
    (set) => ({
      step: 1,
      firstname: '',
      lastname: '',
      gender: '',
      age: 0,
      weight: 0,
      goal: [],
      height: 0,
      descreption: '',
      sleepTime: '',
      extersize: '',
      stressedFeeling: '',
      topPriority: [],
      setField: (field: keyof Omit<WizardStateType, 'setField'>, value: string) => set({ [field]: value }),
      setStep: (step: number) => set({ step }),
      setGoal: (goal: string[]) => set({ goal }),
      setTopPriority: (topPriority: string[]) => set({ topPriority }),
      clear: () => set({ step: 1, firstname: '', gender: '', age: 0, weight: 0, goal: [], height: 0, descreption: '', sleepTime: '', extersize: '', stressedFeeling: '', topPriority: [] }),
    }),
    {
      name: 'wizard-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
