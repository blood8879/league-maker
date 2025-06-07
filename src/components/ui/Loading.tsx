"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "spinner" | "skeleton";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  avatar?: boolean;
  height?: string;
  width?: string;
}

const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      className,
      type = "spinner",
      size = "md",
      text,
      fullScreen = false,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    };

    const textSizeStyles = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    };

    if (type === "spinner") {
      const content = (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-3",
            fullScreen ? "min-h-screen" : "p-4",
            className
          )}
          {...props}
          ref={ref}
        >
          <div
            className={cn(
              "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
              sizeStyles[size]
            )}
            role="status"
            aria-label="로딩 중"
          />
          {text && (
            <span
              className={cn("text-gray-600", textSizeStyles[size])}
              aria-live="polite"
            >
              {text}
            </span>
          )}
        </div>
      );

      if (fullScreen) {
        return (
          <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm">
            {content}
          </div>
        );
      }

      return content;
    }

    return null; // Skeleton은 별도 컴포넌트로 처리
  }
);

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      lines = 3,
      avatar = false,
      height = "h-4",
      width = "w-full",
      ...props
    },
    ref
  ) => {
    const baseStyles = "animate-pulse bg-gray-300 rounded";

    return (
      <div
        ref={ref}
        className={cn("space-y-3", className)}
        role="status"
        aria-label="콘텐츠 로딩 중"
        {...props}
      >
        {avatar && (
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-gray-300 h-10 w-10 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse" />
              <div className="h-3 bg-gray-300 rounded w-1/3 animate-pulse" />
            </div>
          </div>
        )}

        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseStyles,
              height,
              index === lines - 1 ? "w-3/4" : width
            )}
          />
        ))}
      </div>
    );
  }
);

// 특정 용도의 스켈레톤 컴포넌트들
const SkeletonCard = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border p-4 space-y-3", className)}
    role="status"
    aria-label="카드 콘텐츠 로딩 중"
    {...props}
  >
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
      <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse" />
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-300 rounded animate-pulse" />
      <div className="h-3 bg-gray-300 rounded animate-pulse" />
      <div className="h-3 bg-gray-300 rounded w-3/4 animate-pulse" />
    </div>
  </div>
));

const SkeletonTable = forwardRef<
  HTMLDivElement,
  { rows?: number } & React.HTMLAttributes<HTMLDivElement>
>(({ className, rows = 5, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-3", className)}
    role="status"
    aria-label="테이블 데이터 로딩 중"
    {...props}
  >
    {/* 테이블 헤더 */}
    <div className="grid grid-cols-4 gap-4 p-3 border-b">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-4 bg-gray-300 rounded animate-pulse" />
      ))}
    </div>

    {/* 테이블 행들 */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-4 gap-4 p-3">
        {Array.from({ length: 4 }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-3 bg-gray-300 rounded animate-pulse"
          />
        ))}
      </div>
    ))}
  </div>
));

Loading.displayName = "Loading";
Skeleton.displayName = "Skeleton";
SkeletonCard.displayName = "SkeletonCard";
SkeletonTable.displayName = "SkeletonTable";

export { Loading, Skeleton, SkeletonCard, SkeletonTable };
