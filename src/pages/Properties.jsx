import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Property } from "@/entities/Property";
import { useLanguage, usePageTitle } from "@/components/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createPageUrl } from "@/utils";
import { sizedImage, imageSrcSet } from "@/lib/utils";
import { ArrowLeft, ChevronDown, SlidersHorizontal } from "lucide-react";

// A filter field inside the hero search panel: small label over a large value.
// Keyboard focus draws a brass ring around the whole field (WCAG 2.4.7).
function SearchField({ label, children }) {
  return (
    <label className="block min-w-0 rounded-[4px] px-3 pb-1 pt-2 transition-colors focus-within:bg-stone-100 hover:bg-stone-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brass sm:px-4 sm:pt-2.5">
      <span className="block text-[13px] font-medium text-stone-600">{label}</span>
      {children}
    </label>
  );
}

const fieldSelect =
  "h-9 rounded-none border-0 bg-transparent px-0 pe-7 text-base font-medium text-ink focus-visible:ring-0 sm:text-lg";

// Max-price steps. Sale and rent prices live on different scales, so the list
// follows the chosen deal type (both groups when "sale or rent" is chosen).
const PRICE_STEPS = {
  sale: [3000000, 5000000, 8000000, 10000000, 15000000],
  rent: [5000, 7500, 10000, 15000],
};

const SORTS = ["newest", "price-asc", "price-desc", "area-desc"];
const PROPERTY_TYPES = ["apartment", "garden_apartment", "duplex", "penthouse", "mini_penthouse", "house", "villa", "commercial", "plot"];

// Compact shekel label for the price menu: "₪5M" / "5 מיליון ₪", "₪7,500" / "7,500 ₪".
function priceStepLabel(value, lang) {
  if (value >= 1000000) {
    const m = value / 1000000;
    return lang === "he" ? `${m} מיליון ₪` : `₪${m}M`;
  }
  return new Intl.NumberFormat(lang === "he" ? "he-IL" : "en-US", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Properties() {
  const { language } = useLanguage();
  const t = (en, he) => (language === "he" ? he : en);
  usePageTitle(t("Properties for sale and rent", "נכסים למכירה ולהשכרה"));

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const resultsRef = useRef(null);
  const [filtersOpen, setFiltersOpen] = useState(false); // phones only

  // Filters and sort live in the URL (#/Properties?city=Haifa&deal=sale…), so a
  // filtered list can be shared, survives a reload and comes back on Back.
  const [params, setParams] = useSearchParams();
  const cityParam = params.get("city") || "all";
  const listingType = ["sale", "rent"].includes(params.get("deal")) ? params.get("deal") : "all";
  const propertyType = PROPERTY_TYPES.includes(params.get("type")) ? params.get("type") : "all";
  const maxPrice = Number(params.get("max")) > 0 ? Number(params.get("max")) : null;
  const sort = SORTS.includes(params.get("sort")) ? params.get("sort") : "newest";

  // Updates one or more URL params; "all"/empty removes them. Replaces the
  // history entry so filtering doesn't fill the Back button.
  const updateParams = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "" || value === "all" || (key === "sort" && value === "newest")) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    setParams(next, { replace: true });
  };
  const setCity = (v) => updateParams({ city: v });
  const setPropertyType = (v) => updateParams({ type: v });
  const setSort = (v) => updateParams({ sort: v });
  // Changing deal type drops a max price that belongs to the other scale.
  const setListingType = (v) => {
    const steps = v === "all" ? [...PRICE_STEPS.sale, ...PRICE_STEPS.rent] : PRICE_STEPS[v];
    updateParams({ deal: v, max: maxPrice && steps.includes(maxPrice) ? maxPrice : null });
  };
  const setMaxPrice = (v) => updateParams({ max: v === "all" ? null : v });

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

  // A city in a shared or old link that no longer has listings falls back to "all".
  const city =
    cityParam !== "all" && !loading && !cityOptions.some((c) => c.en === cityParam) ? "all" : cityParam;

  const filtered = useMemo(() => {
    const list = properties.filter((p) => {
      if (city !== "all" && p.city !== city) return false;
      if (listingType !== "all" && p.listing_type !== listingType) return false;
      if (propertyType !== "all" && p.property_type !== propertyType) return false;
      if (maxPrice !== null && Number(p.price) > maxPrice) return false;
      return true;
    });
    // `properties` already arrives newest first.
    const by = {
      "price-asc": (a, b) => Number(a.price) - Number(b.price),
      "price-desc": (a, b) => Number(b.price) - Number(a.price),
      "area-desc": (a, b) => Number(b.area) - Number(a.area),
    }[sort];
    return by ? [...list].sort(by) : list;
  }, [properties, city, listingType, propertyType, maxPrice, sort]);

  const priceOptionsFor = (deal) =>
    PRICE_STEPS[deal].map((v) => ({ value: String(v), label: priceStepLabel(v, language) }));

  // The hero shows a real listing: the first featured exclusive one with a photo.
  const heroProperty = useMemo(
    () =>
      properties.find((p) => p.featured && p.exclusive && p.images?.length) ||
      properties.find((p) => p.featured && p.images?.length) ||
      properties.find((p) => p.images?.length),
    [properties]
  );
  const heroImage = heroProperty?.images?.[0];

  const activeFilters = [city !== "all", listingType !== "all", propertyType !== "all", maxPrice !== null].filter(Boolean).length;
  const isFiltered = activeFilters > 0;
  // Clears the filters; the chosen sort order stays.
  const clearFilters = () => updateParams({ city: null, deal: null, type: null, max: null });

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
      <section className="relative isolate flex min-h-[500px] flex-col overflow-hidden bg-ink text-white sm:min-h-[640px] lg:h-[calc(100svh-4rem)] lg:max-h-[860px]">
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

        <div className="relative mx-auto mt-auto w-full max-w-7xl px-4 pb-4 pt-24 sm:px-6 sm:pb-8 sm:pt-28 lg:px-8 lg:pb-10">
          <h1 className="max-w-3xl font-display text-[2.5rem] font-bold leading-[1.08] text-white [text-wrap:balance] sm:text-6xl lg:text-7xl">
            {t("Find Your Next Home", "מצאו את הבית הבא שלכם")}
          </h1>
          <p className="mt-3 max-w-xl text-base text-stone-200 sm:mt-4 sm:text-xl">
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
            className="mt-6 grid grid-cols-2 gap-1 rounded-[4px] bg-white p-1.5 text-ink shadow-panel sm:mt-8 sm:p-2 lg:max-w-6xl lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-center"
          >
            {/* On phones the four fields fold behind a "Filters" toggle so the
                photograph keeps the first screen; from sm up they sit in the panel. */}
            <div
              id="search-fields"
              className={`${filtersOpen ? "grid" : "hidden"} col-span-2 grid-cols-2 gap-1 sm:contents`}
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
            <SearchField label={t("Max price", "מחיר עד")}>
              <Select
                value={maxPrice ? String(maxPrice) : "all"}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={fieldSelect}
              >
                <option value="all">{t("Any price", "כל מחיר")}</option>
                {listingType === "all" ? (
                  <>
                    <optgroup label={t("For sale", "למכירה")}>
                      {priceOptionsFor("sale").map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label={t("For rent, per month", "להשכרה, לחודש")}>
                      {priceOptionsFor("rent").map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </optgroup>
                  </>
                ) : (
                  priceOptionsFor(listingType).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))
                )}
              </Select>
            </SearchField>
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              aria-controls="search-fields"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] px-3 text-base font-semibold text-ink ring-1 ring-inset ring-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass sm:hidden"
            >
              <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
              {t("Filters", "סינון")}
              {activeFilters > 0 && (
                <span className="tabular-nums text-brass-dark">({activeFilters})</span>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform motion-reduce:transition-none ${filtersOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-ink px-4 text-base font-semibold text-white transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 disabled:opacity-60 sm:col-span-2 sm:mt-1 sm:min-h-14 sm:px-7 lg:col-span-1 lg:mt-0"
            >
              <span className="tabular-nums">
                {loading ? t("Show listings", "הצגת נכסים") : t(`Show ${countLabel(filtered.length)}`, `הצגת ${countLabel(filtered.length)}`)}
              </span>
            </button>
          </form>

          {/* Caption for the photograph: bottom-end corner, under the search */}
          {heroProperty && (
            <div className="mt-3 flex justify-end lg:max-w-6xl">
              <Link
                to={createPageUrl(`PropertyDetail?id=${heroProperty.id}`)}
                className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-[4px] bg-ink/70 px-3.5 text-sm text-stone-200 transition-colors hover:bg-ink/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-light"
              >
                <span className="truncate">
                  <span className="text-stone-400">{t("Pictured: ", "בתמונה: ")}</span>
                  {t(heroProperty.title, heroProperty.title_he || heroProperty.title)}
                  {" · "}
                  {t(heroProperty.city, heroProperty.city_he || heroProperty.city)}
                </span>
                <ArrowLeft className="h-4 w-4 shrink-0 ltr:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section
        ref={resultsRef}
        tabIndex={-1}
        aria-labelledby="results-heading"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-8 focus:outline-none sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-stone-300 pb-3 sm:mb-8 sm:gap-y-2 sm:pb-5">
          <h2 id="results-heading" className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {isFiltered ? t("Matching properties", "נכסים מתאימים") : t("All properties", "כל הנכסים")}
          </h2>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-stone-600">
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
            <label className="flex items-center gap-2">
              <span className="text-[15px]">{t("Sort by", "מיון לפי")}</span>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 min-w-[11rem] bg-transparent text-[15px] font-medium"
                options={[
                  { value: "newest", label: t("Newest first", "החדשים ביותר") },
                  { value: "price-asc", label: t("Price: low to high", "מחיר: מהנמוך לגבוה") },
                  { value: "price-desc", label: t("Price: high to low", "מחיר: מהגבוה לנמוך") },
                  { value: "area-desc", label: t("Largest first", "השטח הגדול ביותר") },
                ]}
              />
            </label>
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
              {t("Try another city, deal type or price.", "אפשר לנסות עיר, סוג עסקה או מחיר אחרים.")}
            </p>
            <Button
              type="button"
              onClick={clearFilters}
              className="mt-6 text-base"
            >
              {t("Show all properties", "הצגת כל הנכסים")}
            </Button>
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
