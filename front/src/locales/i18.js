import i18n from "i18next";
import { initReactI18next } from "react-i18next";
//import en from "./en.json";
import ar from "./ar.json";
import fr from './fr.json';

i18n.use(initReactI18next).init({
  resources: {
    //en: { translation: en },
    ar: { translation: ar },
    fr: { translation: fr },
  },
  lng: "ar", // Default language
  fallbackLng: "ar", // Fallback if the selected language is missing
  interpolation: { escapeValue: false },
});

export default i18n;
