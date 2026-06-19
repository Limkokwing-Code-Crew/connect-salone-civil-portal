import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "kri", name: "Krio", flag: "🇸🇱" },
  { code: "men", name: "Mende", flag: "🇸🇱" },
  { code: "tem", name: "Temne", flag: "🇸🇱" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-2 xs:px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-0 shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Language: ${currentLanguage.name}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-base xs:text-lg">{currentLanguage.flag}</span>
        <span className="text-xs xs:text-sm font-medium truncate">
          {currentLanguage.name}
        </span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[100]">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                void i18n.changeLanguage(language.code);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left text-gray-900 dark:text-gray-100"
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>

              {i18n.language === language.code && (
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
