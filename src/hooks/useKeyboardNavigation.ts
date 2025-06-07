import { useCallback, useEffect, useRef, useState } from "react";
import {
  getFocusableElements,
  trapFocus,
  handleArrowNavigation,
  focusElement,
} from "../lib/accessibility";

// ===============================
// 포커스 트랩 훅
// ===============================

export interface UseFocusTrapOptions {
  isActive: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export function useFocusTrap<T extends HTMLElement>({
  isActive,
  autoFocus = true,
  restoreFocus = true,
  initialFocusRef,
}: UseFocusTrapOptions) {
  const containerRef = useRef<T>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // 현재 활성 요소 저장
    lastActiveElementRef.current = document.activeElement as HTMLElement;

    // 초기 포커스 설정
    if (autoFocus) {
      const initialElement =
        initialFocusRef?.current ||
        getFocusableElements(containerRef.current)[0];

      if (initialElement) {
        focusElement(initialElement);
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (containerRef.current) {
        trapFocus(containerRef.current, event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // 포커스 복원
      if (restoreFocus && lastActiveElementRef.current) {
        focusElement(lastActiveElementRef.current);
      }
    };
  }, [isActive, autoFocus, restoreFocus, initialFocusRef]);

  return containerRef;
}

// ===============================
// ESC 키 처리 훅
// ===============================

export function useEscapeKey(callback: () => void, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback, isActive]);
}

// ===============================
// 화살표 키 네비게이션 훅
// ===============================

export interface UseArrowNavigationOptions {
  isActive?: boolean;
  orientation?: "horizontal" | "vertical";
  selector?: string;
  onNavigate?: (index: number, element: HTMLElement) => void;
}

export function useArrowNavigation<T extends HTMLElement>({
  isActive = true,
  orientation = "vertical",
  selector,
  onNavigate,
}: UseArrowNavigationOptions = {}) {
  const containerRef = useRef<T>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const getNavigableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    if (selector) {
      return Array.from(containerRef.current.querySelectorAll(selector));
    }

    return getFocusableElements(containerRef.current);
  }, [selector]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive || !containerRef.current) return;

      const elements = getNavigableElements();
      if (elements.length === 0) return;

      const currentElement = document.activeElement as HTMLElement;
      const currentElementIndex = elements.indexOf(currentElement);

      if (currentElementIndex === -1) return;

      const newIndex = handleArrowNavigation(
        event,
        elements,
        currentElementIndex,
        orientation
      );

      if (newIndex !== currentElementIndex) {
        setCurrentIndex(newIndex);
        onNavigate?.(newIndex, elements[newIndex]);
      }
    },
    [isActive, orientation, onNavigate, getNavigableElements]
  );

  useEffect(() => {
    if (!isActive) return;

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, isActive]);

  const focusIndex = useCallback(
    (index: number) => {
      const elements = getNavigableElements();
      if (elements[index]) {
        focusElement(elements[index]);
        setCurrentIndex(index);
        onNavigate?.(index, elements[index]);
      }
    },
    [getNavigableElements, onNavigate]
  );

  const focusFirst = useCallback(() => {
    focusIndex(0);
  }, [focusIndex]);

  const focusLast = useCallback(() => {
    const elements = getNavigableElements();
    focusIndex(elements.length - 1);
  }, [focusIndex, getNavigableElements]);

  return {
    containerRef,
    currentIndex,
    focusIndex,
    focusFirst,
    focusLast,
    getNavigableElements,
  };
}

// ===============================
// 키보드 단축키 훅
// ===============================

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  callback: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrlKey = false,
          shiftKey = false,
          altKey = false,
          metaKey = false,
          callback,
          preventDefault = true,
        } = shortcut;

        const keyMatches = event.key === key || event.code === key;
        const modifiersMatch =
          event.ctrlKey === ctrlKey &&
          event.shiftKey === shiftKey &&
          event.altKey === altKey &&
          event.metaKey === metaKey;

        if (keyMatches && modifiersMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback(event);
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts, isActive]);
}

// ===============================
// 롤오버 네비게이션 훅 (메뉴, 드롭다운 등)
// ===============================

export interface UseRovingTabIndexOptions {
  isActive?: boolean;
  orientation?: "horizontal" | "vertical";
  selector?: string;
  defaultIndex?: number;
}

export function useRovingTabIndex<T extends HTMLElement>({
  isActive = true,
  orientation = "vertical",
  selector = '[role="menuitem"], [role="option"], button, [tabindex]',
  defaultIndex = 0,
}: UseRovingTabIndexOptions = {}) {
  const containerRef = useRef<T>(null);
  const [focusedIndex, setFocusedIndex] = useState(defaultIndex);

  const getElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll(selector));
  }, [selector]);

  // 탭 인덱스 업데이트
  useEffect(() => {
    const elements = getElements();

    elements.forEach((element, index) => {
      element.setAttribute("tabindex", index === focusedIndex ? "0" : "-1");
    });
  }, [focusedIndex, getElements]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive) return;

      const elements = getElements();
      if (elements.length === 0) return;

      let newIndex = focusedIndex;

      if (orientation === "vertical") {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            newIndex = (focusedIndex + 1) % elements.length;
            break;
          case "ArrowUp":
            event.preventDefault();
            newIndex =
              focusedIndex === 0 ? elements.length - 1 : focusedIndex - 1;
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
        switch (event.key) {
          case "ArrowRight":
            event.preventDefault();
            newIndex = (focusedIndex + 1) % elements.length;
            break;
          case "ArrowLeft":
            event.preventDefault();
            newIndex =
              focusedIndex === 0 ? elements.length - 1 : focusedIndex - 1;
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

      if (newIndex !== focusedIndex) {
        setFocusedIndex(newIndex);
        focusElement(elements[newIndex]);
      }
    },
    [isActive, orientation, focusedIndex, getElements]
  );

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, isActive]);

  const setFocusedIndexAndFocus = useCallback(
    (index: number) => {
      const elements = getElements();
      if (elements[index]) {
        setFocusedIndex(index);
        focusElement(elements[index]);
      }
    },
    [getElements]
  );

  return {
    containerRef,
    focusedIndex,
    setFocusedIndex: setFocusedIndexAndFocus,
  };
}
