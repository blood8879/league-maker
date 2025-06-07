"use client";

import { useState, useEffect } from "react";
import { breakpoints, mediaQueries } from "@/lib/design-system";

export type BreakpointKey = keyof typeof breakpoints;

export interface ResponsiveState {
  // 현재 활성 breakpoint들
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;

  // 특정 breakpoint 이하인지 확인
  isMobile: boolean; // md 미만
  isTablet: boolean; // md 이상 lg 미만
  isDesktop: boolean; // lg 이상

  // 현재 화면 크기
  width: number;
  height: number;

  // 현재 주요 breakpoint
  currentBreakpoint: BreakpointKey;
}

/**
 * 반응형 상태를 추적하는 커스텀 Hook
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    // SSR을 위한 기본값
    if (typeof window === "undefined") {
      return {
        isXs: false,
        isSm: false,
        isMd: false,
        isLg: false,
        isXl: false,
        is2Xl: false,
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 0,
        height: 0,
        currentBreakpoint: "sm" as BreakpointKey,
      };
    }

    // 클라이언트 사이드 초기값
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      isXs: width >= parseInt(breakpoints.xs),
      isSm: width >= parseInt(breakpoints.sm),
      isMd: width >= parseInt(breakpoints.md),
      isLg: width >= parseInt(breakpoints.lg),
      isXl: width >= parseInt(breakpoints.xl),
      is2Xl: width >= parseInt(breakpoints["2xl"]),
      isMobile: width < parseInt(breakpoints.md),
      isTablet:
        width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg),
      isDesktop: width >= parseInt(breakpoints.lg),
      width,
      height,
      currentBreakpoint: getCurrentBreakpoint(width),
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    function updateState() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        isXs: width >= parseInt(breakpoints.xs),
        isSm: width >= parseInt(breakpoints.sm),
        isMd: width >= parseInt(breakpoints.md),
        isLg: width >= parseInt(breakpoints.lg),
        isXl: width >= parseInt(breakpoints.xl),
        is2Xl: width >= parseInt(breakpoints["2xl"]),
        isMobile: width < parseInt(breakpoints.md),
        isTablet:
          width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg),
        isDesktop: width >= parseInt(breakpoints.lg),
        width,
        height,
        currentBreakpoint: getCurrentBreakpoint(width),
      });
    }

    // resize 이벤트에 디바운싱 적용
    let timeoutId: NodeJS.Timeout;
    function handleResize() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateState, 150);
    }

    window.addEventListener("resize", handleResize);

    // 초기 상태 업데이트
    updateState();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return state;
}

/**
 * 특정 breakpoint가 활성인지 확인하는 Hook
 */
export function useBreakpoint(breakpoint: BreakpointKey): boolean {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(mediaQueries[breakpoint]);

    // 초기 상태 설정
    setIsActive(mediaQuery.matches);

    // 미디어 쿼리 변화 감지
    function handleChange(event: MediaQueryListEvent) {
      setIsActive(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [breakpoint]);

  return isActive;
}

/**
 * 화면 크기에 따른 값을 반환하는 Hook
 */
export function useResponsiveValue<T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
  default: T;
}): T {
  const { currentBreakpoint } = useResponsive();

  // 현재 breakpoint부터 역순으로 확인하여 적절한 값 반환
  if (currentBreakpoint === "2xl" && values["2xl"] !== undefined)
    return values["2xl"];
  if (currentBreakpoint === "xl" && values.xl !== undefined) return values.xl;
  if (currentBreakpoint === "lg" && values.lg !== undefined) return values.lg;
  if (currentBreakpoint === "md" && values.md !== undefined) return values.md;
  if (currentBreakpoint === "sm" && values.sm !== undefined) return values.sm;
  if (currentBreakpoint === "xs" && values.xs !== undefined) return values.xs;

  return values.default;
}

/**
 * 현재 화면 너비에 따라 breakpoint를 결정하는 헬퍼 함수
 */
function getCurrentBreakpoint(width: number): BreakpointKey {
  if (width >= parseInt(breakpoints["2xl"])) return "2xl";
  if (width >= parseInt(breakpoints.xl)) return "xl";
  if (width >= parseInt(breakpoints.lg)) return "lg";
  if (width >= parseInt(breakpoints.md)) return "md";
  if (width >= parseInt(breakpoints.sm)) return "sm";
  return "xs";
}

/**
 * 디바이스 타입을 감지하는 Hook
 */
export function useDeviceType() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
  } as const;
}
