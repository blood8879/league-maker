"use client";

import { forwardRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  border?: boolean;
}

export interface ModalContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  border?: boolean;
  justify?: "start" | "center" | "end" | "between";
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      size = "md",
      className,
      children,
      showCloseButton = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus management
    useEffect(() => {
      if (isOpen) {
        const previousActiveElement = document.activeElement as HTMLElement;
        modalRef.current?.focus();

        return () => {
          previousActiveElement?.focus();
        };
      }
    }, [isOpen]);

    // Escape key handler
    useEffect(() => {
      if (!isOpen || !closeOnEscape) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    // Body scroll lock
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "unset";
        };
      }
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeStyles = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "max-w-full mx-4",
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    };

    return createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />

        {/* Modal */}
        <div
          ref={ref || modalRef}
          className={cn(
            "relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden w-full",
            sizeStyles[size],
            className
          )}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="닫기"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <div className="flex flex-col max-h-[90vh]">{children}</div>
        </div>
      </div>,
      document.body
    );
  }
);

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, border = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex-shrink-0 px-6 py-4",
          border && "border-b border-gray-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, padding = "md", children, ...props }, ref) => {
    const paddingStyles = {
      none: "",
      sm: "p-3",
      md: "px-6 py-4",
      lg: "p-6",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto",
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, border = true, justify = "end", children, ...props }, ref) => {
    const justifyStyles = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex-shrink-0 flex items-center gap-3 px-6 py-4",
          justifyStyles[justify],
          border && "border-t border-gray-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const ModalTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h2>
  );
});

const ModalDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600 mt-1", className)}
      {...props}
    >
      {children}
    </p>
  );
});

Modal.displayName = "Modal";
ModalHeader.displayName = "ModalHeader";
ModalContent.displayName = "ModalContent";
ModalFooter.displayName = "ModalFooter";
ModalTitle.displayName = "ModalTitle";
ModalDescription.displayName = "ModalDescription";

export {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};
