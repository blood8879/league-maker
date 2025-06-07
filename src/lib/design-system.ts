// 디자인 시스템 토큰과 유틸리티 함수들

export const breakpoints = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
} as const;

export const colors = {
  // 기본 색상
  white: "#ffffff",
  black: "#000000",

  // 그레이 스케일
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // 브랜드 색상 (블루)
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  // 성공 (그린)
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },

  // 경고 (옐로우)
  warning: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
    950: "#422006",
  },

  // 에러 (레드)
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },

  // 정보 (블루)
  info: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },
} as const;

export const typography = {
  fontFamily: {
    sans: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "Noto Sans",
      "sans-serif",
    ],
    mono: [
      "Fira Code",
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      "Liberation Mono",
      "Courier New",
      "monospace",
    ],
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
    base: ["1rem", { lineHeight: "1.5rem" }], // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
    "5xl": ["3rem", { lineHeight: "1" }], // 48px
    "6xl": ["3.75rem", { lineHeight: "1" }], // 60px
    "7xl": ["4.5rem", { lineHeight: "1" }], // 72px
    "8xl": ["6rem", { lineHeight: "1" }], // 96px
    "9xl": ["8rem", { lineHeight: "1" }], // 128px
  },
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
} as const;

export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  none: "0 0 #0000",
} as const;

// 미디어 쿼리 헬퍼 함수
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  "2xl": `(min-width: ${breakpoints["2xl"]})`,

  // max-width 버전
  "max-xs": `(max-width: ${parseInt(breakpoints.xs) - 1}px)`,
  "max-sm": `(max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  "max-md": `(max-width: ${parseInt(breakpoints.md) - 1}px)`,
  "max-lg": `(max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  "max-xl": `(max-width: ${parseInt(breakpoints.xl) - 1}px)`,
  "max-2xl": `(max-width: ${parseInt(breakpoints["2xl"]) - 1}px)`,
} as const;

// 반응형 유틸리티 함수
export const responsive = {
  // 현재 화면 크기가 특정 breakpoint보다 큰지 확인
  isBreakpoint: (breakpoint: keyof typeof breakpoints): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(mediaQueries[breakpoint]).matches;
  },

  // 화면 크기에 따른 값 반환
  getValueByBreakpoint: <T>(values: {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    "2xl"?: T;
    default: T;
  }): T => {
    if (typeof window === "undefined") return values.default;

    if (responsive.isBreakpoint("2xl") && values["2xl"]) return values["2xl"];
    if (responsive.isBreakpoint("xl") && values.xl) return values.xl;
    if (responsive.isBreakpoint("lg") && values.lg) return values.lg;
    if (responsive.isBreakpoint("md") && values.md) return values.md;
    if (responsive.isBreakpoint("sm") && values.sm) return values.sm;
    if (responsive.isBreakpoint("xs") && values.xs) return values.xs;

    return values.default;
  },

  // 컨테이너 최대 너비 계산
  getContainerMaxWidth: (): string => {
    return responsive.getValueByBreakpoint({
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      default: "100%",
    });
  },
} as const;

// 컴포넌트 크기 시스템
export const componentSizes = {
  xs: {
    padding: `${spacing[1]} ${spacing[2]}`, // py-1 px-2
    fontSize: typography.fontSize.xs[0],
    borderRadius: borderRadius.sm,
  },
  sm: {
    padding: `${spacing[1.5]} ${spacing[3]}`, // py-1.5 px-3
    fontSize: typography.fontSize.sm[0],
    borderRadius: borderRadius.DEFAULT,
  },
  md: {
    padding: `${spacing[2]} ${spacing[4]}`, // py-2 px-4
    fontSize: typography.fontSize.sm[0],
    borderRadius: borderRadius.DEFAULT,
  },
  lg: {
    padding: `${spacing[3]} ${spacing[6]}`, // py-3 px-6
    fontSize: typography.fontSize.base[0],
    borderRadius: borderRadius.md,
  },
  xl: {
    padding: `${spacing[4]} ${spacing[8]}`, // py-4 px-8
    fontSize: typography.fontSize.lg[0],
    borderRadius: borderRadius.lg,
  },
} as const;

// 애니메이션 관련
export const animations = {
  transition: {
    fast: "150ms ease-in-out",
    base: "200ms ease-in-out",
    slow: "300ms ease-in-out",
  },
  duration: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
  },
  easing: {
    "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
    "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
    "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// 공통 컴포넌트 스타일
export const commonStyles = {
  // 포커스 링 스타일
  focusRing:
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",

  // 비활성화 스타일
  disabled: "disabled:opacity-50 disabled:cursor-not-allowed",

  // 트랜지션
  transition: "transition-colors duration-200 ease-in-out",

  // 스크린 리더 전용 텍스트
  srOnly: "sr-only",

  // 컨테이너 스타일
  container: "mx-auto px-4 sm:px-6 lg:px-8",

  // 카드 스타일
  card: "bg-white rounded-lg border border-gray-200 shadow-sm",

  // 버튼 기본 스타일
  button:
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
} as const;

export type BreakpointKey = keyof typeof breakpoints;
export type SpacingKey = keyof typeof spacing;
export type ColorKey = keyof typeof colors;
export type ComponentSize = keyof typeof componentSizes;
