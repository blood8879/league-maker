import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// ===============================
// 접근성 설정 타입
// ===============================

export interface AccessibilitySettings {
  // 모션/애니메이션 설정
  prefersReducedMotion: boolean;

  // 색상 및 대비 설정
  prefersHighContrast: boolean;
  prefersColorScheme: "light" | "dark" | "auto";

  // 폰트 및 크기 설정
  fontSize: "small" | "medium" | "large" | "extra-large";

  // 스크린 리더 설정
  isScreenReaderActive: boolean;
  announcements: boolean;

  // 키보드 네비게이션 설정
  showFocusOutlines: boolean;
  keyboardNavigation: boolean;

  // 기타 설정
  autoplay: boolean;
  transparencyReduction: boolean;
}

export interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  announceMessage: (message: string, priority?: "polite" | "assertive") => void;
}

// ===============================
// 기본 설정
// ===============================

const defaultSettings: AccessibilitySettings = {
  prefersReducedMotion: false,
  prefersHighContrast: false,
  prefersColorScheme: "auto",
  fontSize: "medium",
  isScreenReaderActive: false,
  announcements: true,
  showFocusOutlines: true,
  keyboardNavigation: true,
  autoplay: true,
  transparencyReduction: false,
};

// ===============================
// 컨텍스트 생성
// ===============================

const AccessibilityContext = createContext<
  AccessibilityContextValue | undefined
>(undefined);

// ===============================
// 미디어 쿼리 감지 함수들
// ===============================

function detectReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function detectHighContrast(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-contrast: high)").matches;
}

function detectColorScheme(): "light" | "dark" | "auto" {
  if (typeof window === "undefined") return "auto";

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "auto";
}

function detectScreenReader(): boolean {
  if (typeof window === "undefined") return false;

  // Screen reader detection heuristics
  return !!(
    navigator.userAgent.includes("NVDA") ||
    navigator.userAgent.includes("JAWS") ||
    navigator.userAgent.includes("VoiceOver") ||
    window.speechSynthesis ||
    "tts" in window.navigator
  );
}

// ===============================
// 로컬 스토리지 키
// ===============================

const STORAGE_KEY = "league-maker-accessibility-settings";

function loadSettingsFromStorage(): Partial<AccessibilitySettings> {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveSettingsToStorage(settings: AccessibilitySettings): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage failed, ignore
  }
}

// ===============================
// Provider 컴포넌트
// ===============================

export interface AccessibilityProviderProps {
  children: ReactNode;
  initialSettings?: Partial<AccessibilitySettings>;
}

export function AccessibilityProvider({
  children,
  initialSettings = {},
}: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // 시스템 설정과 저장된 설정을 병합
    const systemSettings: Partial<AccessibilitySettings> = {
      prefersReducedMotion: detectReducedMotion(),
      prefersHighContrast: detectHighContrast(),
      prefersColorScheme: detectColorScheme(),
      isScreenReaderActive: detectScreenReader(),
    };

    const storedSettings = loadSettingsFromStorage();

    return {
      ...defaultSettings,
      ...systemSettings,
      ...storedSettings,
      ...initialSettings,
    };
  });

  // 시스템 설정 변경 감지
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueries = [
      {
        query: window.matchMedia("(prefers-reduced-motion: reduce)"),
        handler: (e: MediaQueryListEvent) => {
          setSettings((prev) => ({ ...prev, prefersReducedMotion: e.matches }));
        },
      },
      {
        query: window.matchMedia("(prefers-contrast: high)"),
        handler: (e: MediaQueryListEvent) => {
          setSettings((prev) => ({ ...prev, prefersHighContrast: e.matches }));
        },
      },
      {
        query: window.matchMedia("(prefers-color-scheme: dark)"),
        handler: () => {
          setSettings((prev) => ({
            ...prev,
            prefersColorScheme: detectColorScheme(),
          }));
        },
      },
      {
        query: window.matchMedia("(prefers-color-scheme: light)"),
        handler: () => {
          setSettings((prev) => ({
            ...prev,
            prefersColorScheme: detectColorScheme(),
          }));
        },
      },
    ];

    // 리스너 등록
    mediaQueries.forEach(({ query, handler }) => {
      if (query.addEventListener) {
        query.addEventListener("change", handler);
      } else {
        // Legacy browsers
        query.addListener(handler);
      }
    });

    // 정리
    return () => {
      mediaQueries.forEach(({ query, handler }) => {
        if (query.removeEventListener) {
          query.removeEventListener("change", handler);
        } else {
          // Legacy browsers
          query.removeListener(handler);
        }
      });
    };
  }, []);

  // CSS 커스텀 속성 업데이트
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    // 폰트 크기 설정
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
      "extra-large": "20px",
    };
    root.style.setProperty("--base-font-size", fontSizeMap[settings.fontSize]);

    // 모션 설정
    root.style.setProperty(
      "--motion-duration",
      settings.prefersReducedMotion ? "0ms" : "200ms"
    );

    // 포커스 아웃라인 설정
    root.style.setProperty(
      "--focus-outline-width",
      settings.showFocusOutlines ? "2px" : "0px"
    );

    // 고대비 모드 클래스 적용
    if (settings.prefersHighContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // 투명도 감소 클래스 적용
    if (settings.transparencyReduction) {
      root.classList.add("reduce-transparency");
    } else {
      root.classList.remove("reduce-transparency");
    }

    // 색상 테마 설정
    root.setAttribute("data-theme", settings.prefersColorScheme);
  }, [settings]);

  // 설정 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    const systemSettings: Partial<AccessibilitySettings> = {
      prefersReducedMotion: detectReducedMotion(),
      prefersHighContrast: detectHighContrast(),
      prefersColorScheme: detectColorScheme(),
      isScreenReaderActive: detectScreenReader(),
    };

    setSettings({ ...defaultSettings, ...systemSettings });
  };

  const announceMessage = (
    message: string,
    priority: "polite" | "assertive" = "polite"
  ) => {
    if (!settings.announcements) return;

    // 스크린 리더 공지 구현
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };

  const value: AccessibilityContextValue = {
    settings,
    updateSettings,
    resetSettings,
    announceMessage,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// ===============================
// 커스텀 훅
// ===============================

export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext);

  if (context === undefined) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }

  return context;
}

export function useAccessibilitySettings(): AccessibilitySettings {
  return useAccessibility().settings;
}

export function useReducedMotion(): boolean {
  return useAccessibilitySettings().prefersReducedMotion;
}

export function useHighContrast(): boolean {
  return useAccessibilitySettings().prefersHighContrast;
}

export function useScreenReader(): boolean {
  return useAccessibilitySettings().isScreenReaderActive;
}

export function useAnnouncement() {
  const { announceMessage } = useAccessibility();
  return announceMessage;
}
