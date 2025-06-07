"use client";

import { forwardRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavigationItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  children?: NavigationItem[];
}

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  items: NavigationItem[];
  variant?: "horizontal" | "vertical" | "mobile";
  showIcons?: boolean;
  showLabels?: boolean;
  compact?: boolean;
}

export interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  items: NavigationItem[];
  className?: string;
}

const Navigation = forwardRef<HTMLElement, NavigationProps>(
  (
    {
      className,
      items,
      variant = "horizontal",
      showIcons = true,
      showLabels = true,
      compact = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = "flex";

    const variantStyles = {
      horizontal: "flex-row space-x-1",
      vertical: "flex-col space-y-1",
      mobile: "flex-col space-y-2",
    };

    const renderNavigationItem = (item: NavigationItem, index: number) => {
      const itemClasses = cn(
        "flex items-center transition-colors rounded-md",
        compact ? "px-2 py-1" : "px-3 py-2",
        item.active
          ? "bg-blue-100 text-blue-700 font-medium"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        item.disabled && "opacity-50 cursor-not-allowed",
        variant === "horizontal" ? "text-sm" : "text-base"
      );

      const content = (
        <>
          {showIcons && item.icon && (
            <span className={cn("flex-shrink-0", showLabels && "mr-2")}>
              {item.icon}
            </span>
          )}
          {showLabels && <span>{item.label}</span>}
        </>
      );

      if (item.href) {
        return (
          <Link
            key={index}
            href={item.href}
            className={itemClasses}
            aria-disabled={item.disabled}
          >
            {content}
          </Link>
        );
      }

      return (
        <button
          key={index}
          onClick={item.onClick}
          disabled={item.disabled}
          className={itemClasses}
          type="button"
        >
          {content}
        </button>
      );
    };

    return (
      <nav
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {items.map(renderNavigationItem)}
      </nav>
    );
  }
);

const MobileNavigation = forwardRef<HTMLDivElement, MobileNavigationProps>(
  ({ isOpen, onToggle, items, className }, ref) => {
    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={onToggle}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors md:hidden"
          aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {isOpen ? (
            <svg
              className="h-6 w-6"
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
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Mobile menu overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-25"
              onClick={onToggle}
            />
            <div
              ref={ref}
              className={cn(
                "absolute top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
                className
              )}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">메뉴</h2>
                  <button
                    onClick={onToggle}
                    className="p-1 rounded-md text-gray-600 hover:text-gray-900"
                    aria-label="메뉴 닫기"
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
                </div>
                <Navigation
                  items={items}
                  variant="mobile"
                  showIcons={true}
                  showLabels={true}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

// Header Navigation Component
const HeaderNavigation = forwardRef<
  HTMLElement,
  {
    leftItems?: NavigationItem[];
    rightItems?: NavigationItem[];
    mobileItems?: NavigationItem[];
    logo?: React.ReactNode;
    className?: string;
  }
>(
  (
    { leftItems = [], rightItems = [], mobileItems = [], logo, className },
    ref
  ) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
      <header
        ref={ref}
        className={cn("bg-white border-b border-gray-200", className)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            {logo && <div className="flex-shrink-0">{logo}</div>}

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-8">
              <Navigation
                items={leftItems}
                variant="horizontal"
                showIcons={false}
                showLabels={true}
              />
            </div>

            <div className="hidden md:flex md:items-center md:space-x-4">
              <Navigation
                items={rightItems}
                variant="horizontal"
                showIcons={true}
                showLabels={true}
                compact={true}
              />
            </div>

            {/* Mobile Navigation */}
            <MobileNavigation
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              items={
                mobileItems.length > 0
                  ? mobileItems
                  : [...leftItems, ...rightItems]
              }
            />
          </div>
        </div>
      </header>
    );
  }
);

// Bottom Tab Navigation for mobile
const BottomNavigation = forwardRef<
  HTMLElement,
  {
    items: NavigationItem[];
    className?: string;
  }
>(({ items, className }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden",
        className
      )}
    >
      <div className="grid grid-cols-5 max-w-sm mx-auto">
        {items.slice(0, 5).map((item, index) => {
          const itemClasses = cn(
            "flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors",
            item.active ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
          );

          if (item.href) {
            return (
              <Link key={index} href={item.href} className={itemClasses}>
                {item.icon && <span className="mb-1">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={index}
              onClick={item.onClick}
              className={itemClasses}
              type="button"
            >
              {item.icon && <span className="mb-1">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

Navigation.displayName = "Navigation";
MobileNavigation.displayName = "MobileNavigation";
HeaderNavigation.displayName = "HeaderNavigation";
BottomNavigation.displayName = "BottomNavigation";

export { Navigation, MobileNavigation, HeaderNavigation, BottomNavigation };
