import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "kr", name: "Krio", flag: "🇸🇱" },
  { code: "md", name: "Mende", flag: "🇸🇱" },
  { code: "tm", name: "Temne", flag: "🇸🇱" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg glass-surface hover:bg-white/70 dark:hover:bg-white/10 transition-colors">
        <span>{currentLanguage.flag}</span>
        <span className="text-sm font-medium">{currentLanguage.name}</span>
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

      <div className="absolute right-0 mt-1 w-48 glass-surface rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => i18n.changeLanguage(language.code)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
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
    </div>
  );
}
