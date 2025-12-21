import { useState, useEffect, useRef } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { SignOutButton } from "../SignOutButton";

interface MobileMenuProps {
  theme: "light" | "dark" | "system";
  onCycle: () => void;
}

export function MobileMenu({ theme, onCycle }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close menu when pressing Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative sm:hidden" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <svg
            className="w-5 h-5"
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
            className="w-5 h-5"
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

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-3 space-y-2">
              {/* Tour button */}
              <button
                onClick={() => {
                  // Handle tour click
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left text-gray-900 dark:text-gray-100"
              >
                <span className="w-5 h-5 flex items-center justify-center text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded">
                  ?
                </span>
                Quick Tour
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Language Section */}
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                  Language
                </p>
                <LanguageSwitcher />
              </div>

              {/* Theme Section */}
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                  Theme
                </p>
                <ThemeToggle theme={theme} onCycle={onCycle} />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Sign Out */}
              <div className="px-3 py-2">
                <SignOutButton />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
