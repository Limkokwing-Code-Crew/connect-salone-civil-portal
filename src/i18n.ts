import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import en from "../locales/en.json";
import kri from "../locales/kri.json";
import men from "../locales/men.json";
import tem from "../locales/tem.json";

const resources = {
  en: { translation: en },
  kri: { translation: kri },
  men: { translation: men },
  tem: { translation: tem },
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
