import type {
  ProfileFormData,
  ProfileValidationErrors,
  Position,
} from "@/types/profile";
import React from "react";

/**
 * 이름 유효성 검사
 */
export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return "이름을 입력해주세요.";
  }
  if (name.trim().length < 2) {
    return "이름은 2글자 이상이어야 합니다.";
  }
  if (name.trim().length > 20) {
    return "이름은 20글자 이하여야 합니다.";
  }
  return null;
};

/**
 * 전화번호 유효성 검사
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone || !phone.trim()) {
    return "전화번호를 입력해주세요.";
  }

  // 숫자만 추출
  const numbersOnly = phone.replace(/\D/g, "");

  // 11자리 숫자인지 확인
  if (numbersOnly.length !== 11) {
    return "전화번호는 11자리 숫자여야 합니다.";
  }

  // 010으로 시작하는지 확인
  if (!numbersOnly.startsWith("010")) {
    return "전화번호는 010으로 시작해야 합니다.";
  }

  // 010-xxxx-xxxx 형식으로 유효한지 최종 확인
  const phoneRegex = /^010\d{8}$/;
  if (!phoneRegex.test(numbersOnly)) {
    return "올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)";
  }

  return null;
};

/**
 * 포지션 유효성 검사 (배열 기반)
 */
export const validatePosition = (positions: Position[]): string | null => {
  const validPositions: Position[] = [
    "GK", // 골키퍼
    "DR", // 우측 수비수
    "DC", // 중앙 수비수
    "DL", // 좌측 수비수
    "DMC", // 수비형 미드필더
    "MC", // 중앙 미드필더
    "AML", // 좌측 공격형 미드필더
    "AMC", // 중앙 공격형 미드필더
    "AMR", // 우측 공격형 미드필더
    "ST", // 스트라이커
  ];

  // 최소 하나의 포지션은 선택해야 함
  if (!positions || positions.length === 0) {
    return "최소 하나의 포지션을 선택해주세요.";
  }

  // 모든 포지션이 유효한지 확인
  for (const position of positions) {
    if (!validPositions.includes(position)) {
      return "올바른 포지션을 선택해주세요.";
    }
  }

  // 중복 포지션 확인
  const uniquePositions = [...new Set(positions)];
  if (uniquePositions.length !== positions.length) {
    return "중복된 포지션을 선택할 수 없습니다.";
  }

  return null;
};

/**
 * 프로필 폼 전체 유효성 검사
 */
export const validateProfileForm = (
  formData: ProfileFormData
): ProfileValidationErrors => {
  const errors: ProfileValidationErrors = {};

  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;

  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  const positionError = validatePosition(formData.position);
  if (positionError) errors.position = positionError;

  return errors;
};

/**
 * 유효성 검사 오류가 있는지 확인
 */
export const hasValidationErrors = (
  errors: ProfileValidationErrors
): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * 전화번호 포맷팅 (하이픈 추가)
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * 전화번호를 DB 저장용으로 변환 (숫자만)
 */
export const normalizePhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, "");
};

/**
 * DB에서 가져온 전화번호를 표시용으로 포맷팅
 */
export const formatPhoneForDisplay = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("010")) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * 전화번호 입력 필터링 (숫자만 허용, 최대 11자리)
 */
export const filterPhoneInput = (value: string): string => {
  // 숫자만 추출
  const numbersOnly = value.replace(/\D/g, "");

  // 최대 11자리로 제한
  return numbersOnly.slice(0, 11);
};

/**
 * 전화번호 실시간 포맷팅 (입력 중 하이픈 자동 추가)
 */
export const formatPhoneInput = (value: string): string => {
  // 먼저 숫자만 필터링
  const filtered = filterPhoneInput(value);

  // 길이에 따라 하이픈 추가
  if (filtered.length <= 3) {
    return filtered;
  } else if (filtered.length <= 7) {
    return `${filtered.slice(0, 3)}-${filtered.slice(3)}`;
  } else {
    return `${filtered.slice(0, 3)}-${filtered.slice(3, 7)}-${filtered.slice(
      7
    )}`;
  }
};

/**
 * 전화번호 입력 이벤트 핸들러
 * React onChange 이벤트에서 사용
 */
export const handlePhoneInputChange = (
  value: string,
  onChange: (formattedValue: string, rawValue: string) => void
): void => {
  const formattedValue = formatPhoneInput(value);
  const rawValue = filterPhoneInput(value);
  onChange(formattedValue, rawValue);
};

/**
 * 키보드 입력 필터링 (숫자, 백스페이스, 삭제키만 허용)
 */
export const filterPhoneKeyInput = (event: KeyboardEvent): boolean => {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
  ];

  // 허용된 키이거나 숫자키인 경우만 허용
  if (allowedKeys.includes(event.key) || /^\d$/.test(event.key)) {
    return true;
  }

  // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X 허용
  if (event.ctrlKey && ["a", "c", "v", "x"].includes(event.key.toLowerCase())) {
    return true;
  }

  return false;
};

/**
 * 강력한 전화번호 입력 제어 - 숫자 외 모든 입력 차단
 */
export const preventNonNumericInput = (
  event: React.KeyboardEvent<HTMLInputElement>
): void => {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ];

  const isNumericKey = /^\d$/.test(event.key);
  const isAllowedKey = allowedKeys.includes(event.key);
  const isCtrlKey =
    event.ctrlKey &&
    ["a", "c", "v", "x", "z"].includes(event.key.toLowerCase());

  if (!isNumericKey && !isAllowedKey && !isCtrlKey) {
    event.preventDefault();
    event.stopPropagation();
  }
};

/**
 * 붙여넣기 이벤트 처리 - 숫자만 추출하여 붙여넣기
 */
export const handlePhonePaste = (
  event: React.ClipboardEvent<HTMLInputElement>,
  currentValue: string,
  onChange: (value: string) => void
): void => {
  event.preventDefault();

  const pastedText = event.clipboardData.getData("text");
  const numbersOnly = pastedText.replace(/\D/g, "");

  if (numbersOnly) {
    // 현재 입력된 숫자와 붙여넣은 숫자를 합쳐서 11자리까지만 허용
    const currentNumbers = currentValue.replace(/\D/g, "");
    const combinedNumbers = (currentNumbers + numbersOnly).slice(0, 11);
    const formattedValue = formatPhoneInput(combinedNumbers);
    onChange(formattedValue);
  }
};

/**
 * 입력 이벤트 처리 - 마지막 방어선
 */
export const handlePhoneInputEvent = (
  event: React.FormEvent<HTMLInputElement>,
  onChange: (value: string) => void
): void => {
  const target = event.target as HTMLInputElement;
  const filteredValue = filterPhoneInput(target.value);
  const formattedValue = formatPhoneInput(filteredValue);

  if (target.value !== formattedValue) {
    onChange(formattedValue);
  }
};

/**
 * 완전한 전화번호 입력 제어 Hook
 * 사용법: const phoneProps = usePhoneInput(initialValue, onValueChange);
 * 그리고 <input {...phoneProps} />
 */
export const usePhoneInput = (
  initialValue: string = "",
  onValueChange?: (formattedValue: string, rawValue: string) => void
) => {
  const [value, setValue] = React.useState(formatPhoneInput(initialValue));

  const handleChange = (newValue: string) => {
    const filteredValue = filterPhoneInput(newValue);
    const formattedValue = formatPhoneInput(filteredValue);
    setValue(formattedValue);

    if (onValueChange) {
      onValueChange(formattedValue, filteredValue);
    }
  };

  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e.target.value);
    },
    onKeyDown: preventNonNumericInput,
    onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => {
      handlePhonePaste(e, value, handleChange);
    },
    onInput: (e: React.FormEvent<HTMLInputElement>) => {
      handlePhoneInputEvent(e, handleChange);
    },
    type: "text" as const,
    inputMode: "numeric" as const,
    pattern: "[0-9]*",
    maxLength: 13, // 010-1234-5678 (하이픈 포함)
  };
};
