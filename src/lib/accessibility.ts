import { RefObject } from "react";

// ===============================
// ID 생성 유틸리티
// ===============================

let idCounter = 0;

/**
 * 고유한 ID를 생성합니다. 접근성을 위한 element ID 생성에 사용됩니다.
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * 컴포넌트에 대한 설명적인 ID를 생성합니다.
 */
export function generateAriaId(
  componentName: string,
  type: "label" | "description" | "error" = "label"
): string {
  return generateId(`${componentName}-${type}`);
}

// ===============================
// ARIA 유틸리티
// ===============================

/**
 * ARIA 라벨 속성을 생성합니다.
 */
export interface AriaLabelProps {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export function createAriaLabel(
  label?: string,
  labelledBy?: string,
  describedBy?: string
): AriaLabelProps {
  const props: AriaLabelProps = {};

  if (label) props["aria-label"] = label;
  if (labelledBy) props["aria-labelledby"] = labelledBy;
  if (describedBy) props["aria-describedby"] = describedBy;

  return props;
}

/**
 * 확장된 상태를 위한 ARIA 속성을 생성합니다 (드롭다운, 모달 등).
 */
export function createAriaExpanded(isExpanded: boolean) {
  return {
    "aria-expanded": isExpanded,
    "aria-haspopup": true as const,
  };
}

/**
 * 선택된 상태를 위한 ARIA 속성을 생성합니다.
 */
export function createAriaSelected(isSelected: boolean) {
  return {
    "aria-selected": isSelected,
  };
}

/**
 * 체크된 상태를 위한 ARIA 속성을 생성합니다.
 */
export function createAriaChecked(isChecked: boolean | "mixed") {
  return {
    "aria-checked": isChecked,
  };
}

// ===============================
// 포커스 관리
// ===============================

/**
 * 요소에 포커스를 설정합니다.
 */
export function focusElement(element: HTMLElement | null): void {
  if (element && typeof element.focus === "function") {
    // 접근성을 위해 약간의 지연을 둡니다
    setTimeout(() => {
      element.focus();
    }, 0);
  }
}

/**
 * ref를 통해 요소에 포커스를 설정합니다.
 */
export function focusRef<T extends HTMLElement>(ref: RefObject<T>): void {
  focusElement(ref.current);
}

/**
 * 포커스 가능한 요소들을 찾습니다.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(", ");

  return Array.from(container.querySelectorAll(focusableSelectors));
}

/**
 * 포커스 트랩을 구현합니다 (모달, 드롭다운 등에 사용).
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== "Tab") return;

  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

// ===============================
// 키보드 네비게이션
// ===============================

/**
 * 화살표 키 네비게이션을 위한 핸들러입니다.
 */
export function handleArrowNavigation(
  event: KeyboardEvent,
  elements: HTMLElement[],
  currentIndex: number,
  orientation: "horizontal" | "vertical" = "vertical"
): number {
  const { key } = event;
  let newIndex = currentIndex;

  if (orientation === "vertical") {
    switch (key) {
      case "ArrowDown":
        event.preventDefault();
        newIndex = (currentIndex + 1) % elements.length;
        break;
      case "ArrowUp":
        event.preventDefault();
        newIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = elements.length - 1;
        break;
    }
  } else {
    switch (key) {
      case "ArrowRight":
        event.preventDefault();
        newIndex = (currentIndex + 1) % elements.length;
        break;
      case "ArrowLeft":
        event.preventDefault();
        newIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = elements.length - 1;
        break;
    }
  }

  if (newIndex !== currentIndex && elements[newIndex]) {
    elements[newIndex].focus();
  }

  return newIndex;
}

// ===============================
// 색상 대비 유틸리티
// ===============================

/**
 * RGB 색상을 luminance로 변환합니다.
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 두 색상 간의 대비율을 계산합니다.
 */
export function getContrastRatio(color1: string, color2: string): number {
  // 간단한 hex 색상만 지원 (#ffffff 형식)
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);

  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);

  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * WCAG 대비 기준을 확인합니다.
 */
export function checkContrastCompliance(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA"
): {
  ratio: number;
  normal: boolean;
  large: boolean;
} {
  const ratio = getContrastRatio(foreground, background);
  const normalThreshold = level === "AA" ? 4.5 : 7;
  const largeThreshold = level === "AA" ? 3 : 4.5;

  return {
    ratio,
    normal: ratio >= normalThreshold,
    large: ratio >= largeThreshold,
  };
}

// ===============================
// 스크린 리더 유틸리티
// ===============================

/**
 * 스크린 리더 전용 텍스트를 위한 클래스입니다.
 */
export const srOnlyClass = "sr-only";

/**
 * 스크린 리더에게 변경사항을 알립니다.
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = srOnlyClass;
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // 메시지를 읽은 후 제거
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ===============================
// 접근성 검증
// ===============================

/**
 * 요소가 접근 가능한지 확인합니다.
 */
export function isElementAccessible(element: HTMLElement): {
  hasLabel: boolean;
  hasRole: boolean;
  isKeyboardAccessible: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // 라벨 확인
  const hasLabel = !!(
    element.getAttribute("aria-label") ||
    element.getAttribute("aria-labelledby") ||
    element.textContent?.trim() ||
    (element as HTMLInputElement).labels?.length
  );

  if (!hasLabel) {
    issues.push("Element lacks accessible label");
  }

  // 역할 확인
  const hasRole = !!(
    element.getAttribute("role") ||
    element.tagName.toLowerCase() === "button" ||
    element.tagName.toLowerCase() === "input" ||
    element.tagName.toLowerCase() === "a"
  );

  if (!hasRole) {
    issues.push("Element lacks semantic role");
  }

  // 키보드 접근성 확인
  const tabIndex = element.getAttribute("tabindex");
  const isKeyboardAccessible =
    tabIndex !== "-1" &&
    (element.tagName.toLowerCase() === "button" ||
      element.tagName.toLowerCase() === "input" ||
      element.tagName.toLowerCase() === "a" ||
      tabIndex === "0" ||
      parseInt(tabIndex || "0") >= 0);

  if (!isKeyboardAccessible) {
    issues.push("Element is not keyboard accessible");
  }

  return {
    hasLabel,
    hasRole,
    isKeyboardAccessible,
    issues,
  };
}
