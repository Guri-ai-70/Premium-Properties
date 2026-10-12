import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Property } from "@/entities/Property";
import { useLanguage, usePageTitle } from "@/components/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createPageUrl } from "@/utils";
import { sizedImage, imageSrcSet } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

// A filter field inside the hero search panel: small label over a large value.
function SearchField({ label, children }) {
  return (
    <label className="block rounded-[4px] px-4 pb-1 pt-2.5 transition-colors focus-within:bg-stone-100 hover:bg-stone-50">
      <span className="block text-[13px] font-medium text-stone-600">{label}</span>
      {children}
    </label>
  );
}

const fieldSelect =
  "h-9 rounded-none border-0 bg-transparent px-0 pe-7 text-[17px] font-medium text-ink focus-visible:ring-0";

export default function Properties() {
  const { language } = useLanguage();
  const t = (en, he) => (language === "he" ? he : en);
  usePageTitle(t("Properties for sale and rent", "נכסים למכירה ולהשכרה"));

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("all");
  const [listingType, setListingType] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const resultsRef = useRef(null);

  useEffect(() => {
    (async () => {
      const items = await Property.filter({ status: "available" }, "-created_date");
      setProperties(items);
      setLoading(false);
    })();
  }, []);

  // Cities dropdown is built from the cities that actually have published
  // listings — add a property in a new city and it appears here; remove the
  // last property in a city and it disappears automatically.
  const cityOptions = useMemo(() => {
    const map = new Map();
    properties.forEach((p) => {
      if (p.city && !map.has(p.city)) {
        map.set(p.city, { en: p.city, he: p.city_he || p.city });
      }
    });
    // Sort by the name the visitor actually sees (Hebrew order in Hebrew mode).
    return Array.from(map.values()).sort((a, b) =>
      language === "he" ? a.he.localeCompare(b.he, "he") : a.en.localeCompare(b.en, "en")
    );
  }, [properties, language]);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (city !== "all" && p.city !== city) return false;
      if (listingType !== "all" && p.listing_type !== listingType) return false;
      if (propertyType !== "all" && p.property_type !== propertyType) return false;
      return true;
    });
  }, [properties, city, listingType, propertyType]);

  // The hero shows a real listing: the first featured exclusive one with a photo.
  const heroProperty = useMemo(
    () =>
      properties.find((p) => p.featured && p.exclusive && p.images?.length) ||
      properties.find((p) => p.featured && p.images?.length) ||
      properties.find((p) => p.images?.length),
    [properties]
  );
  const heroImage = heroProperty?.images?.[0];

  const isFiltered = city !== "all" || listingType !== "all" || propertyType !== "all";
  const clearFilters = () => {
    setCity("all");
    setListingType("all");
    setPropertyType("all");
  };

  const showResults = () => {
    const el = resultsRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
  };

  const countLabel = (n) =>
    language === "he"
      ? n === 1 ? "נכס אחד" : `${n} נכסים`
      : n === 1 ? "1 listing" : `${n} listings`;

  return (
    <div>
      {/* Hero: a real listing's photograph with the search set into it */}
      <section className="relative isolate flex min-h-[620px] flex-col overflow-hidden bg-ink text-white sm:min-h-[640px] lg:h-[calc(100svh-4rem)] lg:max-h-[860px]">
        {heroImage && (
          <img
            src={sizedImage(heroImage, 1600)}
            srcSet={imageSrcSet(heroImage, [800, 1200, 1600, 2400])}
            sizes="100vw"
            alt=""
            fetchpriority="high"
            className="motion-safe-settle absolute inset-0 -z-20 h-full w-full animate-settle object-cover"
          />
        )}
        {/* Scrim: darkest where the text and search sit */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/20"
        />

        {heroProperty && (
          <Link
            to={createPageUrl(`PropertyDetail?id=${heroProperty.id}`)}
            className="group absolute end-4 top-4 inline-flex min-h-11 max-w-[calc(100%-2rem)] items-center gap-2 rounded-[4px] bg-ink/70 px-3.5 text-sm text-stone-200 transition-colors hover:bg-ink/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-light sm:end-6 sm:top-6"
          >
            <span className="truncate">
              <span className="text-stone-400">{t("Pictured: ", "בתמונה: ")}</span>
              {t(heroProperty.title, heroProperty.title_he || heroProperty.title)}
              {" · "}
              {t(heroProperty.city, heroProperty.city_he || heroProperty.city)}
            </span>
            <ArrowLeft className="h-4 w-4 shrink-0 ltr:rotate-180" aria-hidden="true" />
          </Link>
        )}

        <div className="relative mx-auto mt-auto w-full max-w-7xl px-4 pb-8 pt-28 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
          <h1 className="max-w-3xl font-display text-[2.75rem] font-bold leading-[1.08] text-white [text-wrap:balance] sm:text-6xl lg:text-7xl">
            {t("Find Your Next Home", "מצאו את הבית הבא שלכם")}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-stone-200 sm:text-xl">
            {t(
              "A curated selection of premium properties for sale and rent across Israel.",
              "מבחר נכסי יוקרה למכירה ולהשכרה ברחבי ישראל."
            )}
          </p>

          {/* Search: filters apply live; the button takes you to the results */}
          <form
            role="search"
            aria-label={t("Search properties", "חיפוש נכסים")}
            onSubmit={(e) => {
              e.preventDefault();
              showResults();
            }}
            className="mt-8 grid gap-1 rounded-md bg-white p-2 text-ink shadow-panel sm:grid-cols-3 lg:max-w-5xl lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-center"
          >
            <SearchField label={t("City", "עיר")}>
              <Select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={fieldSelect}
                options={[
                  { value: "all", label: t("All cities", "כל הערים") },
                  ...cityOptions.map((c) => ({
                    value: c.en,
                    label: language === "he" ? c.he : c.en,
                  })),
                ]}
              />
            </SearchField>
            <SearchField label={t("Deal", "סוג עסקה")}>
              <Select
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
                className={fieldSelect}
                options={[
                  { value: "all", label: t("Sale or rent", "מכירה או השכרה") },
                  { value: "sale", label: t("For Sale", "למכירה") },
                  { value: "rent", label: t("For Rent", "להשכרה") },
                ]}
              />
            </SearchField>
            <SearchField label={t("Property type", "סוג נכס")}>
              <Select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={fieldSelect}
                options={[
                  { value: "all", label: t("All types", "כל הסוגים") },
                  { value: "apartment", label: t("Apartment", "דירה") },
                  { value: "garden_apartment", label: t("Garden Apartment", "דירת גן") },
                  { value: "duplex", label: t("Duplex", "דופלקס") },
                  { value: "penthouse", label: t("Penthouse", "פנטהאוז") },
                  { value: "mini_penthouse", label: t("Mini Penthouse", "מיני פנטהאוז") },
                  { value: "house", label: t("House", "בית") },
                  { value: "villa", label: t("Villa", "וילה") },
                  { value: "commercial", label: t("Commercial", "מסחרי") },
                  { value: "plot", label: t("Plot", "מגרש") },
                ]}
              />
            </SearchField>
            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex min-h-14 items-center justify-center gap-2 rounded-[4px] bg-ink px-7 text-base font-semibold text-white transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 disabled:opacity-60 sm:col-span-3 lg:col-span-1 lg:mt-0"
            >
              <span className="tabular-nums">
                {loading ? t("Show listings", "הצגת נכסים") : t(`Show ${countLabel(filtered.length)}`, `הצגת ${countLabel(filtered.length)}`)}
              </span>
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section
        ref={resultsRef}
        tabIndex={-1}
        aria-labelledby="results-heading"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 focus:outline-none sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-stone-300 pb-5">
          <h2 id="results-heading" className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {isFiltered ? t("Matching properties", "נכסים מתאימים") : t("All properties", "כל הנכסים")}
          </h2>
          <div className="flex items-center gap-4 text-stone-600">
            {!loading && (
              <span className="tabular-nums" aria-live="polite">
                {countLabel(filtered.length)}
              </span>
            )}
            {isFiltered && (
              <button
                type="button"
                onClick={clearFilters}
                className="min-h-11 rounded-[4px] px-1 font-medium text-brass-dark underline decoration-brass/40 underline-offset-4 hover:decoration-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                {t("Clear filters", "ניקוי סינון")}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/3] w-full rounded-[4px] bg-stone-200" />
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-4 w-1/3 bg-stone-200" />
                  <Skeleton className="h-6 w-2/3 bg-stone-200" />
                  <Skeleton className="h-5 w-1/2 bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[4px] border border-dashed border-stone-300 px-6 py-20 text-center">
            <p className="font-display text-2xl font-bold text-ink">
              {t("No properties match these filters", "אין נכסים שמתאימים לסינון הזה")}
            </p>
            <p className="mt-2 text-stone-600">
              {t("Try another city or deal type.", "אפשר לנסות עיר או סוג עסקה אחרים.")}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex min-h-11 items-center rounded-[4px] bg-ink px-5 font-semibold text-white hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2"
            >
              {t("Show all properties", "הצגת כל הנכסים")}
            </button>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
