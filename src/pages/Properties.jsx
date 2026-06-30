import React, { useEffect, useMemo, useState } from "react";
import { Property } from "@/entities/Property";
import { useLanguage } from "@/components/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search, Building2 } from "lucide-react";

export default function Properties() {
  const { language } = useLanguage();
  const t = (en, he) => (language === "he" ? he : en);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("all");
  const [propertyType, setPropertyType] = useState("all");

  useEffect(() => {
    (async () => {
      const items = await Property.filter({ status: "available" }, "-created_date");
      setProperties(items);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return properties.filter((p) => {
      if (listingType !== "all" && p.listing_type !== listingType) return false;
      if (propertyType !== "all" && p.property_type !== propertyType) return false;
      if (!q) return true;
      const haystack = [
        p.title,
        p.title_he,
        p.city,
        p.city_he,
        p.address,
        p.address_he,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [properties, search, listingType, propertyType]);

  const featured = filtered.filter((p) => p.featured);

  const stats = [
    { value: properties.length, label: t("Listings", "נכסים") },
    {
      value: properties.filter((p) => p.listing_type === "sale").length,
      label: t("For Sale", "למכירה"),
    },
    {
      value: properties.filter((p) => p.listing_type === "rent").length,
      label: t("For Rent", "להשכרה"),
    },
    {
      value: properties.filter((p) => p.exclusive).length,
      label: t("Exclusive", "בבלעדיות"),
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900" />
        <div
          className="absolute inset-0 opacity-20 mix-blend-luminosity"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100 ring-1 ring-white/20">
            {t("Premium Real Estate", "נדל\"ן יוקרתי")}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            {t("Find Your Next Home", "מצאו את הבית הבא שלכם")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            {t(
              "Browse a curated selection of premium properties for sale and rent across Israel.",
              "עיינו במבחר נכסי יוקרה למכירה ולהשכרה ברחבי ישראל."
            )}
          </p>

          {/* Filters */}
          <div className="mt-8 grid gap-3 rounded-2xl bg-white/10 p-4 shadow-xl ring-1 ring-white/15 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search city or address...", "חיפוש עיר או כתובת...")}
                className="pl-9 text-slate-900"
              />
            </div>
            <Select
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              className="text-slate-900"
              options={[
                { value: "all", label: t("All listings", "כל הנכסים") },
                { value: "sale", label: t("For Sale", "למכירה") },
                { value: "rent", label: t("For Rent", "להשכרה") },
              ]}
            />
            <Select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="text-slate-900"
              options={[
                { value: "all", label: t("All types", "כל הסוגים") },
                { value: "apartment", label: t("Apartment", "דירה") },
                { value: "house", label: t("House", "בית") },
                { value: "villa", label: t("Villa", "וילה") },
                { value: "commercial", label: t("Commercial", "מסחרי") },
                { value: "land", label: t("Land", "קרקע") },
              ]}
            />
          </div>

          {/* Live stats */}
          <div className="mt-8 grid max-w-2xl grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold sm:text-3xl">{s.value}</div>
                <div className="text-xs text-blue-200 sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-center text-slate-500">{t("Loading...", "טוען...")}</p>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-5 text-2xl font-bold text-slate-900">
                  {t("Featured Properties", "נכסים מומלצים")}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </section>
            )}

            {/* All results */}
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  {t("All Properties", "כל הנכסים")}
                </h2>
                <span className="text-sm text-slate-500">
                  {filtered.length} {t("results", "תוצאות")}
                </span>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 text-slate-400">
                  <Building2 className="mb-3 h-10 w-10" />
                  <p>{t("No properties match your search.", "אין נכסים התואמים לחיפוש.")}</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
