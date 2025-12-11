import {
  LABEL_KEY_VALUE_REGEX,
  MAX_LABEL_KEY_LENGTH,
  MAX_LABEL_VALUE_LENGTH,
  MAX_LABELS_COUNT,
  MAX_NAME_LENGTH,
  NAMESPACE_NAME_REGEX,
} from '../constants/validation';
import { ValidationState } from '../models/validation';

export function validateNamespaceName(value: string): ValidationState {
  if (!value.trim()) {
    return 'empty';
  }
  if (value.length > MAX_NAME_LENGTH || !NAMESPACE_NAME_REGEX.test(value)) {
    return 'invalid';
  }
  return false;
}

export function validateLabelKey(value: string): ValidationState {
  if (!value.trim()) {
    return 'empty';
  }
  if (value.length > MAX_LABEL_KEY_LENGTH || !LABEL_KEY_VALUE_REGEX.test(value)) {
    return 'invalid';
  }
  return false;
}

export function validateLabelValue(value: string): ValidationState {
  if (!value.trim()) {
    return 'empty';
  }
  if (value.length > MAX_LABEL_VALUE_LENGTH || !LABEL_KEY_VALUE_REGEX.test(value)) {
    return 'invalid';
  }
  return false;
}

export function checkLabelLimitExceeded(
  labels: string[],
  key: string
): boolean {
  const isDuplicate = labels.some(label => label.startsWith(`${key}=`));
  return !isDuplicate && labels.length >= MAX_LABELS_COUNT;
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as any).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }
  return '알 수 없는 오류';
}

