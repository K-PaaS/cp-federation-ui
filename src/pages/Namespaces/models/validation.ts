export type ValidationState = false | 'empty' | 'invalid';

export interface LabelInputState {
  key: string;
  value: string;
  keyValidation: ValidationState;
  valueValidation: ValidationState;
}

