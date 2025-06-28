export interface WizardStateType {
  step: number;

  firstname: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  descreption: string;

  goal: string;
  extersize: string;
  sleepTime: string;

  stressedFeeling: string;
  TopPriority: string;

  setField: (field: keyof Omit<WizardStateType, 'setField'>, value: string) => void;
  clear: () => void;
}
