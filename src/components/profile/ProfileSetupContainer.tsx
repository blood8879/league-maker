"use client";

import { useState } from "react";
import ProfileSetupForm from "./ProfileSetupForm";
import LocationSetupForm from "./LocationSetupForm";

type SetupStep = "profile" | "location" | "complete";

interface ProfileSetupContainerProps {
  onComplete?: () => void;
}

export default function ProfileSetupContainer({
  onComplete,
}: ProfileSetupContainerProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>("profile");

  const handleProfileComplete = () => {
    setCurrentStep("location");
  };

  const handleLocationComplete = () => {
    setCurrentStep("complete");
    if (onComplete) {
      onComplete();
    }
  };

  // 단계별 렌더링
  switch (currentStep) {
    case "profile":
      return <ProfileSetupForm onComplete={handleProfileComplete} />;
    case "location":
      return <LocationSetupForm onComplete={handleLocationComplete} />;
    case "complete":
      return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              설정이 완료되었습니다!
            </h2>
            <p className="text-gray-600">
              이제 League Maker의 모든 기능을 이용하실 수 있습니다.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                다음 단계
              </h3>
              <ul className="text-xs text-blue-700 space-y-1 text-left">
                <li>• 팀에 가입하거나 새로운 팀을 만들어보세요</li>
                <li>• 경기 일정을 확인하고 참석 여부를 체크하세요</li>
                <li>• 팀원들과 소통하며 League Maker를 즐겨보세요!</li>
              </ul>
            </div>

            <button
              onClick={() => {
                if (onComplete) {
                  onComplete();
                }
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              League Maker 시작하기!
            </button>
          </div>
        </div>
      );
    default:
      return null;
  }
}
