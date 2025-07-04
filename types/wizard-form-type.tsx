export interface WizardStateType {
  step: number;

  firstname: string;
  lastname: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other' | '';
  descreption: string;

  goal: string[];
  extersize: string;
  sleepTime: string;

  stressedFeeling: string;
  TopPriority: string;

  setField: (field: keyof Omit<WizardStateType, 'setField'>, value: string) => void;
  setStep: (step: number) => void;
  setGoal: (goal: string[]) => void;
  clear: () => void;
}
