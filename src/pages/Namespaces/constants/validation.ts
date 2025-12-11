export const NAMESPACE_NAME_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
export const LABEL_KEY_VALUE_REGEX =
  /^[a-zA-Z0-9]([a-zA-Z0-9-._]*[a-zA-Z0-9])?$/;

export const MAX_NAME_LENGTH = 63;
export const MAX_LABEL_KEY_LENGTH = 63;
export const MAX_LABEL_VALUE_LENGTH = 63;
export const MAX_LABELS_COUNT = 20;

export const ERROR_MESSAGES = {
  NAME_EMPTY: 'Name을 입력하세요',
  NAME_INVALID:
    '1~63자의 소문자 또는 숫자로 시작하고 끝나야 하며, -를 포함할 수 있습니다.',
  KEY_EMPTY: 'Key를 입력하세요',
  KEY_INVALID:
    '1~63자의 영문자 또는 숫자로 시작하고 끝나야 하며, -, ., _를 포함할 수 있습니다.',
  VALUE_EMPTY: 'Value를 입력하세요',
  VALUE_INVALID:
    '1~63자의 영문자 또는 숫자로 시작하고 끝나야 하며, -, ., _를 포함할 수 있습니다.',
  LABEL_LIMIT_EXCEEDED: 'Label은 최대 20개까지 추가할 수 있습니다.',
} as const;

export const TOAST_MESSAGES = {
  CREATING: '네임스페이스를 추가하고 있습니다.',
  SUCCESS: (name: string) => `${name} 네임스페이스가 추가되었습니다.`,
  ERROR_UNKNOWN: '알 수 없는 오류',
} as const;
