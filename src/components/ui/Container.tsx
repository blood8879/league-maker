"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
  padding?: "none" | "sm" | "md" | "lg";
  centerContent?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      maxWidth = "xl",
      padding = "md",
      centerContent = false,
      children,
      ...props
    },
    ref
  ) => {
    const maxWidthStyles = {
      sm: "max-w-screen-sm", // 640px
      md: "max-w-screen-md", // 768px
      lg: "max-w-screen-lg", // 1024px
      xl: "max-w-screen-xl", // 1280px
      "2xl": "max-w-screen-2xl", // 1536px
      full: "max-w-full",
      none: "",
    };

    const paddingStyles = {
      none: "",
      sm: "px-4", // 16px 좌우 패딩
      md: "px-4 sm:px-6 lg:px-8", // 반응형 패딩
      lg: "px-6 sm:px-8 lg:px-12", // 더 큰 패딩
    };

    const baseStyles = "mx-auto w-full";
    const contentStyles = centerContent ? "flex flex-col items-center" : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          maxWidthStyles[maxWidth],
          paddingStyles[padding],
          contentStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// 특별한 목적의 컨테이너들
const PageContainer = forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, "padding"> & { verticalPadding?: boolean }
>(({ className, verticalPadding = true, ...props }, ref) => (
  <Container
    ref={ref}
    className={cn(verticalPadding && "py-6 sm:py-8 lg:py-12", className)}
    padding="md"
    {...props}
  />
));

const SectionContainer = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    maxWidth?: ContainerProps["maxWidth"];
    padding?: ContainerProps["padding"];
  }
>(({ className, maxWidth = "xl", padding = "md", children, ...props }, ref) => (
  <section
    ref={ref}
    className={cn("py-8 sm:py-12 lg:py-16", className)}
    {...props}
  >
    <Container maxWidth={maxWidth} padding={padding}>
      {children}
    </Container>
  </section>
));

const GridContainer = forwardRef<
  HTMLDivElement,
  ContainerProps & {
    cols?: 1 | 2 | 3 | 4 | 6 | 12;
    gap?: "sm" | "md" | "lg" | "xl";
    responsiveCols?: {
      sm?: 1 | 2 | 3 | 4 | 6 | 12;
      md?: 1 | 2 | 3 | 4 | 6 | 12;
      lg?: 1 | 2 | 3 | 4 | 6 | 12;
      xl?: 1 | 2 | 3 | 4 | 6 | 12;
    };
  }
>(
  (
    {
      className,
      cols = 1,
      gap = "md",
      responsiveCols,
      children,
      ...containerProps
    },
    ref
  ) => {
    const gapStyles = {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    };

    const colsStyles = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };

    const responsiveColsClasses = responsiveCols
      ? [
          responsiveCols.sm && `sm:${colsStyles[responsiveCols.sm]}`,
          responsiveCols.md && `md:${colsStyles[responsiveCols.md]}`,
          responsiveCols.lg && `lg:${colsStyles[responsiveCols.lg]}`,
          responsiveCols.xl && `xl:${colsStyles[responsiveCols.xl]}`,
        ]
          .filter(Boolean)
          .join(" ")
      : "";

    return (
      <Container ref={ref} {...containerProps}>
        <div
          className={cn(
            "grid",
            colsStyles[cols],
            gapStyles[gap],
            responsiveColsClasses,
            className
          )}
        >
          {children}
        </div>
      </Container>
    );
  }
);

Container.displayName = "Container";
PageContainer.displayName = "PageContainer";
SectionContainer.displayName = "SectionContainer";
GridContainer.displayName = "GridContainer";

export { Container, PageContainer, SectionContainer, GridContainer };
