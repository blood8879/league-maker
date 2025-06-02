"use client";

import { useState } from "react";

interface WelcomeOnboardingProps {
  onStart: () => void;
}

export default function WelcomeOnboarding({ onStart }: WelcomeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: "League Maker에 오신 것을 환영합니다! 🎉",
      description: "축구 팀 관리의 새로운 경험을 시작하세요",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">⚽</div>
          <p className="text-gray-600">
            League Maker는 축구 팀의 일정 관리, 출석 체크, 통계 추적을 간편하게
            도와주는 플랫폼입니다.
          </p>
        </div>
      ),
    },
    {
      title: "팀을 만들거나 가입하세요 👥",
      description: "함께할 팀원들과 연결되세요",
      content: (
        <div className="space-y-4">
          <div className="text-4xl text-center mb-4">👥</div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">1</span>
              </div>
              <p className="text-gray-600">
                새로운 팀을 만들거나 기존 팀에 가입하세요
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">2</span>
              </div>
              <p className="text-gray-600">
                팀 역할에 따라 다양한 기능을 이용하세요
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">3</span>
              </div>
              <p className="text-gray-600">
                팀원들과 소통하며 더 나은 팀을 만들어가세요
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "경기 관리가 이렇게 쉬울 줄이야! 📅",
      description: "경기 일정부터 출석까지 한 번에",
      content: (
        <div className="space-y-4">
          <div className="text-4xl text-center mb-4">📅</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-sm font-medium text-gray-800">경기 생성</p>
              <p className="text-xs text-gray-600">상대팀, 시간, 장소 설정</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-sm font-medium text-gray-800">출석 체크</p>
              <p className="text-xs text-gray-600">참석 여부 실시간 확인</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm font-medium text-gray-800">통계 관리</p>
              <p className="text-xs text-gray-600">개인/팀 기록 추적</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">🔔</div>
              <p className="text-sm font-medium text-gray-800">알림</p>
              <p className="text-xs text-gray-600">중요한 소식 놓치지 않기</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "시작해볼까요? 🚀",
      description: "프로필을 완성하고 League Maker의 여정을 시작하세요",
      content: (
        <div className="text-center space-y-4">
          <div className="text-4xl mb-4">🚀</div>
          <p className="text-gray-600">
            이제 프로필을 설정하여 League Maker의 모든 기능을 이용해보세요!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-blue-800 mb-2">
              프로필 설정에서는:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• 팀원들이 알아볼 수 있는 이름과 닉네임</li>
              <li>• 연락을 위한 전화번호 (선택사항)</li>
              <li>• 선호하는 포지션 선택</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onStart();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    onStart();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* 진행률 표시기 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {currentStep + 1} / {onboardingSteps.length}
          </span>
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            건너뛰기
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
          {currentStepData.title}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {currentStepData.description}
        </p>
        <div className="min-h-[200px]">{currentStepData.content}</div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>

        <div className="flex space-x-2">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {isLastStep ? "시작하기" : "다음"}
        </button>
      </div>
    </div>
  );
}
