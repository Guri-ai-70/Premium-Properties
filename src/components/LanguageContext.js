import { createContext, useContext } from "react";

// Provides the current language ("en" | "he") and a toggle, supplied by Layout.
export const LanguageContext = createContext({
  language: "en",
  toggleLanguage: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}
