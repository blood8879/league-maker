"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { updateProfile, checkNicknameAvailability } from "@/lib/profile";
import {
  validateProfileForm,
  hasValidationErrors,
  formatPhoneNumber,
} from "@/utils/validation";
import type {
  UserProfile,
  ProfileFormData,
  ProfileValidationErrors,
  Position,
} from "@/types/profile";
import { POSITIONS } from "@/types/profile";

interface ProfileEditFormProps {
  profile: UserProfile;
  onUpdate?: (updatedProfile: UserProfile) => void;
  onCancel?: () => void;
}

export default function ProfileEditForm({
  profile,
  onUpdate,
  onCancel,
}: ProfileEditFormProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile.name,
    nickname: profile.nickname,
    phone: profile.phone || "",
    position: profile.position,
  });
  const [originalData] = useState<ProfileFormData>({
    name: profile.name,
    nickname: profile.nickname,
    phone: profile.phone || "",
    position: profile.position,
  });
  const [errors, setErrors] = useState<ProfileValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nicknameChecking, setNicknameChecking] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(
    null
  );
  const [hasChanges, setHasChanges] = useState(false);

  // 변경사항 확인
  useEffect(() => {
    const changed = Object.keys(formData).some(
      (key) =>
        formData[key as keyof ProfileFormData] !==
        originalData[key as keyof ProfileFormData]
    );
    setHasChanges(changed);
  }, [formData, originalData]);

  // 닉네임 중복 확인 (닉네임이 변경된 경우에만)
  useEffect(() => {
    if (formData.nickname === originalData.nickname) {
      setNicknameAvailable(null);
      return;
    }

    if (!formData.nickname.trim() || formData.nickname.length < 2) {
      setNicknameAvailable(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setNicknameChecking(true);
      const { available } = await checkNicknameAvailability(
        formData.nickname,
        user?.id
      );
      setNicknameAvailable(available);
      setNicknameChecking(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.nickname, originalData.nickname, user?.id]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 해당 필드의 오류 제거
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // 전화번호 자동 포맷팅
    if (field === "phone" && value) {
      const formatted = formatPhoneNumber(value);
      if (formatted !== value) {
        setFormData((prev) => ({ ...prev, phone: formatted }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!hasChanges) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    // 유효성 검사
    const validationErrors = validateProfileForm(formData);

    // 닉네임 중복 확인 (닉네임이 변경된 경우)
    if (
      formData.nickname !== originalData.nickname &&
      nicknameAvailable === false
    ) {
      validationErrors.nickname = "이미 사용 중인 닉네임입니다.";
    }

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 변경된 필드만 업데이트
      const changedFields: Partial<ProfileFormData> = {};
      if (formData.name !== originalData.name) {
        changedFields.name = formData.name;
      }
      if (formData.nickname !== originalData.nickname) {
        changedFields.nickname = formData.nickname;
      }
      if (formData.phone !== originalData.phone) {
        changedFields.phone = formData.phone;
      }
      if (formData.position !== originalData.position) {
        changedFields.position = formData.position;
      }

      const { profile: updatedProfile, error } = await updateProfile(
        user.id,
        changedFields
      );

      if (error) {
        alert(`프로필 업데이트 실패: ${error}`);
        return;
      }

      if (updatedProfile) {
        alert("프로필이 성공적으로 업데이트되었습니다!");
        if (onUpdate) {
          onUpdate(updatedProfile);
        }
      }
    } catch (error) {
      alert("프로필 업데이트 중 오류가 발생했습니다.");
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm("변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?")) {
        setFormData(originalData);
        setErrors({});
        if (onCancel) {
          onCancel();
        }
      }
    } else {
      if (onCancel) {
        onCancel();
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">프로필 편집</h2>
        <p className="text-gray-600 mt-2">프로필 정보를 수정할 수 있습니다</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이름 */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            이름 *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="실명을 입력해주세요"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* 닉네임 */}
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            닉네임 *
          </label>
          <div className="relative">
            <input
              type="text"
              id="nickname"
              value={formData.nickname}
              onChange={(e) => handleInputChange("nickname", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nickname
                  ? "border-red-500"
                  : nicknameAvailable === false
                  ? "border-red-500"
                  : nicknameAvailable === true
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
              placeholder="게임에서 사용할 닉네임"
            />
            {nicknameChecking && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          {errors.nickname && (
            <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>
          )}
          {formData.nickname !== originalData.nickname &&
            nicknameAvailable === true &&
            !errors.nickname && (
              <p className="text-green-500 text-sm mt-1">
                사용 가능한 닉네임입니다
              </p>
            )}
          {formData.nickname !== originalData.nickname &&
            nicknameAvailable === false &&
            !errors.nickname && (
              <p className="text-red-500 text-sm mt-1">
                이미 사용 중인 닉네임입니다
              </p>
            )}
        </div>

        {/* 전화번호 */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            전화번호 (선택사항)
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="010-1234-5678"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* 포지션 */}
        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            선호 포지션 *
          </label>
          <select
            id="position"
            value={formData.position}
            onChange={(e) =>
              handleInputChange("position", e.target.value as Position)
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.position ? "border-red-500" : "border-gray-300"
            }`}
          >
            {POSITIONS.map((position) => (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            ))}
          </select>
          {errors.position && (
            <p className="text-red-500 text-sm mt-1">{errors.position}</p>
          )}
        </div>

        {/* 버튼들 */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !hasChanges ||
              nicknameChecking ||
              (formData.nickname !== originalData.nickname &&
                nicknameAvailable === false)
            }
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
