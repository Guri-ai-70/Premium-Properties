import { createContext, useContext, useEffect } from "react";

// Provides the current language ("en" | "he"), a toggle and the site name, supplied by Layout.
export const LanguageContext = createContext({
  language: "en",
  toggleLanguage: () => {},
  siteName: "",
});

export function useLanguage() {
  return useContext(LanguageContext);
}

// Gives each page its own browser-tab title, e.g. "פנטהאוז עם נוף לים | נכסים פרימיום"
// (WCAG 2.4.2 Page Titled). Pass "" while the page is still loading.
export function usePageTitle(pageTitle) {
  const { siteName } = useContext(LanguageContext);
  useEffect(() => {
    if (pageTitle === "") return;
    document.title = [pageTitle, siteName].filter(Boolean).join(" | ");
  }, [pageTitle, siteName]);
}
