"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/profile";
import {
  validateProfileForm,
  hasValidationErrors,
  preventNonNumericInput,
  handlePhonePaste,
  handlePhoneInputEvent,
  formatPhoneInput,
  normalizePhoneNumber,
  formatPhoneForDisplay,
} from "@/utils/validation";
import type {
  ProfileFormData,
  ProfileValidationErrors,
  Position,
} from "@/types/profile";
import { POSITIONS } from "@/types/profile";

interface ProfileEditFormProps {
  profile: {
    id: string;
    name: string;
    phone: string;
    position: Position[];
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProfileEditForm({
  profile,
  onSuccess,
  onCancel,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile.name,
    phone: formatPhoneForDisplay(profile.phone), // DB에서 가져온 전화번호를 표시용으로 포맷팅
    position: profile.position,
  });
  const [errors, setErrors] = useState<ProfileValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const formatted = formatPhoneInput(value);
      if (formatted !== value) {
        setFormData((prev) => ({ ...prev, phone: formatted }));
      }
    }
  };

  // 전화번호 전용 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneInput(e.target.value);
    handleInputChange("phone", formattedValue);
  };

  // 포지션 선택 핸들러
  const handlePositionChange = (position: Position) => {
    setFormData((prev) => {
      const currentPositions = prev.position;
      const isSelected = currentPositions.includes(position);

      let newPositions: Position[];
      if (isSelected) {
        // 선택 해제
        newPositions = currentPositions.filter((p) => p !== position);
      } else {
        // 선택 추가 (제한 없음)
        newPositions = [...currentPositions, position];
      }

      return { ...prev, position: newPositions };
    });

    // 포지션 관련 오류 제거
    if (errors.position) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.position;
        return newErrors;
      });
    }
  };

  // 전체선택/전체해제 핸들러
  const handleSelectAllPositions = () => {
    setFormData((prev) => {
      const allPositions = POSITIONS.map((p) => p.value);
      const isAllSelected = allPositions.every((pos) =>
        prev.position.includes(pos)
      );

      return {
        ...prev,
        position: isAllSelected ? [] : allPositions,
      };
    });

    // 포지션 관련 오류 제거
    if (errors.position) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.position;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const validationErrors = validateProfileForm(formData);

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // DB 저장용으로 전화번호 정규화
      const normalizedFormData = {
        ...formData,
        phone: normalizePhoneNumber(formData.phone),
      };

      const { profile: updatedProfile, error } = await updateProfile(
        profile.id,
        normalizedFormData
      );

      if (error) {
        alert(`프로필 수정 실패: ${error}`);
        return;
      }

      if (updatedProfile) {
        alert("프로필이 성공적으로 수정되었습니다!");
        onSuccess();
      }
    } catch (error) {
      alert("프로필 수정 중 오류가 발생했습니다.");
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">프로필 수정</h2>
        <p className="text-gray-600 mt-2">프로필 정보를 수정하세요</p>
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

        {/* 전화번호 */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            전화번호 *
          </label>
          <input
            type="text"
            id="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            onKeyDown={preventNonNumericInput}
            onPaste={(e) =>
              handlePhonePaste(e, formData.phone, (value) =>
                handleInputChange("phone", value)
              )
            }
            onInput={(e) =>
              handlePhoneInputEvent(e, (value) =>
                handleInputChange("phone", value)
              )
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="010-1234-5678"
            inputMode="numeric"
            maxLength={13}
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* 포지션 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            선호 포지션 *
          </label>
          <div
            className={`border rounded-md p-3 ${
              errors.position ? "border-red-500" : "border-gray-300"
            }`}
          >
            {/* 전체선택 버튼 */}
            <div className="mb-3 pb-2 border-b border-gray-200">
              <button
                type="button"
                onClick={handleSelectAllPositions}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {POSITIONS.every((pos) => formData.position.includes(pos.value))
                  ? "전체 해제"
                  : "전체 선택"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {POSITIONS.map((position) => (
                <label
                  key={position.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={formData.position.includes(position.value)}
                    onChange={() => handlePositionChange(position.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {position.label}
                  </span>
                </label>
              ))}
            </div>
            {formData.position.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  선택된 포지션: {formData.position.length}개
                </p>
              </div>
            )}
          </div>
          {errors.position && (
            <p className="text-red-500 text-sm mt-1">{errors.position}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            플레이 가능한 포지션을 선택해주세요 (최소 1개 이상)
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                수정 중...
              </span>
            ) : (
              "수정하기"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
