import { WizardStateType } from '@/types/wizard-form-type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWizardStore = create<WizardStateType>()(
  persist(
    (set) => ({
      step: 1,
      firstname: '',
      gender: '',
      age: 0,
      weight: 0,
      goal: '',
      height: 0,
      descreption: '',
      sleepTime: '',
      extersize: '',
      stressedFeeling: '',
      TopPriority: '',
      setField: (field: keyof Omit<WizardStateType, 'setField'>, value: string) => set({ [field]: value }),
      clear: () => set({ step: 1, firstname: '', gender: '', age: 0, weight: 0, goal: '', height: 0, descreption: '', sleepTime: '', extersize: '', stressedFeeling: '', TopPriority: '' }),
    }),
    { name: 'wizard-store' },
  ),
);
