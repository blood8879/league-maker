import type { ProfileFormData, ProfileValidationErrors } from "@/types/profile";

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
 * 닉네임 유효성 검사
 */
export const validateNickname = (nickname: string): string | null => {
  if (!nickname.trim()) {
    return "닉네임을 입력해주세요.";
  }
  if (nickname.trim().length < 2) {
    return "닉네임은 2글자 이상이어야 합니다.";
  }
  if (nickname.trim().length > 15) {
    return "닉네임은 15글자 이하여야 합니다.";
  }
  // 특수문자 제한 (한글, 영문, 숫자, 언더스코어만 허용)
  const nicknameRegex = /^[가-힣a-zA-Z0-9_]+$/;
  if (!nicknameRegex.test(nickname.trim())) {
    return "닉네임은 한글, 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.";
  }
  return null;
};

/**
 * 전화번호 유효성 검사
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone || !phone.trim()) {
    return "전화번호를 입력해주세요."; // 필수값으로 변경
  }

  // 한국 전화번호 형식 검사
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return "올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)";
  }
  return null;
};

/**
 * 포지션 유효성 검사
 */
export const validatePosition = (position: string): string | null => {
  const validPositions = [
    "goalkeeper",
    "defender",
    "midfielder",
    "forward",
    "any",
  ];
  if (!validPositions.includes(position)) {
    return "올바른 포지션을 선택해주세요.";
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

  const nicknameError = validateNickname(formData.nickname);
  if (nicknameError) errors.nickname = nicknameError;

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
