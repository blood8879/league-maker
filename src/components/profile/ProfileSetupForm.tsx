"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { createProfile } from "@/lib/profile";
import {
  validateProfileForm,
  hasValidationErrors,
  preventNonNumericInput,
  handlePhonePaste,
  handlePhoneInputEvent,
  formatPhoneInput,
  normalizePhoneNumber,
} from "@/utils/validation";
import type {
  ProfileFormData,
  ProfileValidationErrors,
  Position,
} from "@/types/profile";
import { POSITIONS } from "@/types/profile";

interface ProfileSetupFormProps {
  onComplete?: () => void;
}

// 프로필 완성도 계산 함수
const calculateCompletionPercentage = (formData: ProfileFormData): number => {
  let completed = 0;
  const requiredFields = 3; // name, position, phone

  if (formData.name.trim()) completed += 1;
  if (formData.position && formData.position.length > 0) completed += 1;
  if (formData.phone.trim()) completed += 1;

  return Math.round((completed / requiredFields) * 100);
};

// 진행률 표시기 컴포넌트
const ProgressIndicator = ({ percentage }: { percentage: number }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">프로필 완성도</span>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {percentage < 100 && (
        <p className="text-xs text-gray-500 mt-1">
          필수 정보를 모두 입력하면 League Maker를 시작할 수 있습니다!
        </p>
      )}
      {percentage === 100 && (
        <p className="text-xs text-green-600 mt-1">
          🎉 프로필 완성! 이제 팀에 참여하거나 새 팀을 만들 수 있습니다.
        </p>
      )}
    </div>
  );
};

// 필드별 완성 상태 표시 컴포넌트
const FieldStatus = ({
  isCompleted,
  isOptional = false,
}: {
  isCompleted: boolean;
  isOptional?: boolean;
}) => {
  if (isCompleted) {
    return <span className="text-green-500 ml-1">✓</span>;
  }
  if (isOptional) {
    return <span className="text-gray-400 ml-1">(선택)</span>;
  }
  return <span className="text-red-500 ml-1">*</span>;
};

export default function ProfileSetupForm({
  onComplete,
}: ProfileSetupFormProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    phone: "",
    position: [], // 빈 배열로 초기화
  });
  const [errors, setErrors] = useState<ProfileValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 완성도 계산
  const completionPercentage = calculateCompletionPercentage(formData);

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
      const formatted = formatPhoneInput(value); // 더 강력한 포맷팅 함수 사용
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

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

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

      const { profile, error } = await createProfile(
        user.id,
        normalizedFormData
      );

      if (error) {
        alert(`프로필 생성 실패: ${error}`);
        return;
      }

      if (profile) {
        // 프로필 생성 완료 - 다음 단계로 진행
        if (onComplete) {
          onComplete();
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      alert("프로필 생성 중 오류가 발생했습니다.");
      console.error("Profile creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">프로필 설정</h2>
        <p className="text-gray-600 mt-2">
          League Maker를 시작하기 위해 프로필을 완성해주세요
        </p>
      </div>

      {/* 진행률 표시기 */}
      <ProgressIndicator percentage={completionPercentage} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이름 */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            이름
            <FieldStatus isCompleted={!!formData.name.trim()} />
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
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            전화번호
            <FieldStatus
              isCompleted={!!formData.phone.trim()}
              isOptional={false}
            />
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
            pattern="010-[0-9]{4}-[0-9]{4}"
            maxLength={13}
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            팀원들과의 연락을 위해 필요합니다
          </p>
        </div>

        {/* 포지션 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            선호 포지션
            <FieldStatus isCompleted={formData.position.length > 0} />
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

        {/* 완성도에 따른 안내 메시지 */}
        {completionPercentage < 100 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-4 w-4 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-sm text-blue-700">
                  {completionPercentage < 100
                    ? "필수 정보(이름, 전화번호, 포지션)를 모두 입력해주세요."
                    : "거의 다 완성되었습니다! 확인 후 제출해주세요."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting || completionPercentage < 100}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              프로필 생성 중...
            </span>
          ) : completionPercentage < 100 ? (
            "필수 정보를 모두 입력해주세요"
          ) : (
            "League Maker 시작하기!"
          )}
        </button>
      </form>

      {/* 다음 단계 안내 */}
      {completionPercentage === 100 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-sm font-medium text-green-800 mb-2">다음 단계</h3>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• 팀에 가입하거나 새로운 팀을 만들어보세요</li>
            <li>• 경기 일정을 확인하고 참석 여부를 체크하세요</li>
            <li>• 팀원들과 소통하며 League Maker를 즐겨보세요!</li>
          </ul>
        </div>
      )}
    </div>
  );
}
