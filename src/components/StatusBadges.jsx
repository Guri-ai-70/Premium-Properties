import React from "react";
import { useLanguage } from "@/components/LanguageContext";

// One frame for every status badge; the fill tells them apart:
// sale = ink, rent = olive, Exclusive = brass, Featured = outlined stone.
const frame =
  "inline-flex rounded-[2px] px-2.5 py-0.5 text-[13px] font-semibold leading-5 shadow-sm ring-1 ring-inset";

// Renders the badges side by side; the caller supplies the wrapper/position.
export default function StatusBadges({ property, showFeatured = false }) {
  const { language } = useLanguage();
  const t = (en, he) => (language === "he" ? he : en);
  const rent = property.listing_type === "rent";

  return (
    <>
      <span
        className={`${frame} text-white ${rent ? "bg-olive ring-olive-light/60" : "bg-ink/90 ring-white/25"}`}
      >
        {rent ? t("For rent", "להשכרה") : t("For sale", "למכירה")}
      </span>
      {property.exclusive && (
        <span className={`${frame} bg-brass-dark text-white ring-brass-light/60`}>
          {t("Exclusive", "בבלעדיות")}
        </span>
      )}
      {showFeatured && property.featured && (
        <span className={`${frame} bg-transparent text-stone-700 shadow-none ring-stone-400`}>
          {t("Featured", "מומלץ")}
        </span>
      )}
    </>
  );
}
