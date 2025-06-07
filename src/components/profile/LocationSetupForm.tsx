"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { updateProfile } from "@/lib/profile";
import { area, type City, type Gu } from "@/utils/area";

interface LocationSetupFormProps {
  onComplete?: () => void;
}

interface LocationFormData {
  city: City | "";
  district: Gu | "";
}

interface LocationValidationErrors {
  city?: string;
  district?: string;
}

const validateLocationForm = (
  formData: LocationFormData
): LocationValidationErrors => {
  const errors: LocationValidationErrors = {};

  if (!formData.city) {
    errors.city = "시/도를 선택해주세요.";
  }

  if (!formData.district) {
    errors.district = "구/군을 선택해주세요.";
  }

  return errors;
};

const hasValidationErrors = (errors: LocationValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export default function LocationSetupForm({
  onComplete,
}: LocationSetupFormProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<LocationFormData>({
    city: "",
    district: "",
  });
  const [errors, setErrors] = useState<LocationValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 선택된 시/도에 따른 구/군 리스트
  const availableDistricts = formData.city
    ? area.find((a) => a.name === formData.city)?.subArea || []
    : [];

  const handleCityChange = (city: City | "") => {
    setFormData({
      city,
      district: "", // 시/도가 변경되면 구/군 초기화
    });

    // 오류 제거
    if (errors.city) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.city;
        return newErrors;
      });
    }
    if (errors.district) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.district;
        return newErrors;
      });
    }
  };

  const handleDistrictChange = (district: Gu | "") => {
    setFormData((prev) => ({ ...prev, district }));

    // 구/군 오류 제거
    if (errors.district) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.district;
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
    const validationErrors = validateLocationForm(formData);

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await updateProfile(user.id, {
        city: formData.city,
        district: formData.district,
      });

      if (error) {
        alert(`지역 설정 실패: ${error}`);
        return;
      }

      // 성공 메시지
      alert(
        "🎉 프로필 설정이 완료되었습니다!\nLeague Maker의 모든 기능을 이용하실 수 있습니다."
      );

      if (onComplete) {
        onComplete();
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      alert("지역 설정 중 오류가 발생했습니다.");
      console.error("Location setup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">지역 설정</h2>
        <p className="text-gray-600 mt-2">
          활동 지역을 설정하여 주변 팀과 매칭해보세요
        </p>
      </div>

      {/* 진행률 표시 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">설정 진행률</span>
          <span className="text-sm text-gray-500">90%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: "90%" }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          마지막 단계입니다! 지역을 선택하면 완료됩니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 시/도 선택 */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            시/도
            {formData.city ? (
              <span className="text-green-500 ml-1">✓</span>
            ) : (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          <select
            id="city"
            value={formData.city}
            onChange={(e) => handleCityChange(e.target.value as City | "")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">시/도를 선택해주세요</option>
            {area.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        {/* 구/군 선택 */}
        <div>
          <label
            htmlFor="district"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            구/군
            {formData.district ? (
              <span className="text-green-500 ml-1">✓</span>
            ) : (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          <select
            id="district"
            value={formData.district}
            onChange={(e) => handleDistrictChange(e.target.value as Gu | "")}
            disabled={!formData.city}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.district ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">
              {formData.city
                ? "구/군을 선택해주세요"
                : "먼저 시/도를 선택해주세요"}
            </option>
            {availableDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">{errors.district}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            주요 활동 지역을 선택해주세요
          </p>
        </div>

        {/* 선택된 지역 미리보기 */}
        {formData.city && formData.district && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center">
              <svg
                className="h-4 w-4 text-blue-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  선택된 지역: {formData.city} {formData.district}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  이 지역의 팀들과 매칭될 수 있습니다!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.city || !formData.district}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              설정 완료 중...
            </span>
          ) : !formData.city || !formData.district ? (
            "지역을 선택해주세요"
          ) : (
            "🎉 프로필 설정 완료!"
          )}
        </button>
      </form>

      {/* 완료 예정 안내 */}
      {formData.city && formData.district && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-sm font-medium text-green-800 mb-2">
            설정 완료 후 이용 가능한 기능
          </h3>
          <ul className="text-xs text-green-700 space-y-1">
            <li>
              • {formData.city} {formData.district} 지역의 팀 검색
            </li>
            <li>• 주변 팀과의 매칭 및 경기 신청</li>
            <li>• 지역 기반 토너먼트 참가</li>
            <li>• 근처 풋살장 정보 확인</li>
          </ul>
        </div>
      )}

      {/* 건너뛰기 옵션 */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            if (onComplete) {
              onComplete();
            } else {
              router.push("/dashboard");
            }
          }}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          나중에 설정하기
        </button>
      </div>
    </div>
  );
}
