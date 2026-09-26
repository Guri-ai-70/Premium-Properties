import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Property } from "@/entities/Property";
import { AppSettings } from "@/entities/AppSettings";
import { createPageUrl } from "@/utils";
import { useLanguage, usePageTitle } from "@/components/LanguageContext";
import { formatPrice } from "@/lib/utils";
import { getRooms, hasRooms, formatFloor, FEATURES } from "@/lib/propertyFeatures";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DoorOpen,
  Building,
  Car,
  Check,
  Bath,
  Maximize,
  MapPin,
  ArrowLeft,
  Mail,
  Phone,
} from "lucide-react";

export default function PropertyDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { language } = useLanguage();
  const t = (en, he) => (language === "he" ? he : en);

  const [property, setProperty] = useState(null);
  const [company, setCompany] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, settings] = await Promise.all([
        Property.get(id),
        AppSettings.filter({ key: "company_details" }),
      ]);
      setProperty(p);
      setCompany(settings[0]?.value || null);
      setLoading(false);
    })();
  }, [id]);

  usePageTitle(
    property
      ? t(property.title, property.title_he || property.title)
      : loading
      ? ""
      : t("Property not found", "הנכס לא נמצא")
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-4 h-9 w-40" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-[420px] w-full" />
            <div className="mt-8 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">
          {t("Property not found", "הנכס לא נמצא")}
        </h1>
        <Link to={createPageUrl("Properties")} className={`mt-8 ${buttonVariants({ variant: "outline" })}`}>
          <ArrowLeft className="me-2 h-4 w-4 rtl:-scale-x-100" />
          {t("Back to Properties", "חזרה לנכסים")}
        </Link>
      </div>
    );
  }

  const title = t(property.title, property.title_he || property.title);
  const description = t(
    property.description,
    property.description_he || property.description
  );
  const city = t(property.city, property.city_he || property.city);
  const address = t(property.address, property.address_he || property.address);
  const images = property.images?.length
    ? property.images
    : ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80"];

  const rooms = getRooms(property);
  const floor = formatFloor(property, language);
  const parking = Number(property.parking) || 0;
  const facts = [
    hasRooms(property) && rooms !== null && {
      icon: DoorOpen,
      label: t("Rooms", "חדרים"),
      value: rooms,
    },
    { icon: Bath, label: t("Bathrooms", "חדרי רחצה"), value: property.bathrooms },
    { icon: Maximize, label: t("Area", "שטח"), value: `${property.area} ${t("m²", "מ\"ר")}` },
    floor && { icon: Building, label: t("Floor", "קומה"), value: floor },
    parking > 0 && { icon: Car, label: t("Parking", "חניה"), value: parking },
  ].filter(Boolean);
  const features = FEATURES.filter((f) => property[f.key]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={createPageUrl("Properties")} className={`mb-4 ${buttonVariants({ variant: "ghost", size: "sm" })}`}>
        <ArrowLeft className="me-2 h-4 w-4 rtl:-scale-x-100" />
        {t("Back to Properties", "חזרה לנכסים")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Gallery + details */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={images[activeImage]}
              alt={title}
              className="h-[420px] w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={t(`Show photo ${i + 1} of ${images.length}`, `הצגת תמונה ${i + 1} מתוך ${images.length}`)}
                  aria-pressed={i === activeImage}
                  className={`h-20 w-28 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-ink">
              {t("Description", "תיאור")}
            </h2>
            <p className="leading-relaxed text-slate-600">{description}</p>
          </div>
        </div>

        {/* Summary card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-surface p-6 shadow-card">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant={property.listing_type === "rent" ? "warning" : "default"}>
                {property.listing_type === "rent" ? t("For Rent", "להשכרה") : t("For Sale", "למכירה")}
              </Badge>
              {property.exclusive && <Badge variant="exclusive">{t("Exclusive", "בבלעדיות")}</Badge>}
              {property.featured && <Badge variant="success">{t("Featured", "מומלץ")}</Badge>}
            </div>

            <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-4 w-4" />
              {address}, {city}
            </p>

            <p className="mt-4 text-3xl font-extrabold text-primary-700">
              {formatPrice(property.price, property.currency, property.listing_type, language)}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {facts.map((f, i) => (
                <div key={i} className="rounded-xl bg-surface-alt p-3 text-center">
                  <f.icon className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <div className="text-sm font-bold text-ink">{f.value}</div>
                  <div className="text-xs text-slate-500">{f.label}</div>
                </div>
              ))}
            </div>

            {features.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-3 font-semibold text-ink">{t("Features", "מאפיינים")}</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {features.map((f) => (
                    <li key={f.key} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                      <f.icon className="h-4 w-4 flex-shrink-0 text-slate-500" />
                      {t(f.en, f.he)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {company && (
              <div className="mt-6 border-t border-slate-100 pt-6">
                <h2 className="mb-3 font-semibold text-ink">
                  {t("Interested? Get in touch", "מעוניינים? צרו קשר")}
                </h2>
                <a href={`mailto:${company.contact_email}`} className={`mb-2 w-full ${buttonVariants()}`}>
                  <Mail className="me-2 h-4 w-4" />
                  {t("Email Agent", "שלחו אימייל")}
                </a>
                <a
                  href={`tel:${company.contact_phone}`}
                  className={`w-full ${buttonVariants({ variant: "outline" })}`}
                  aria-label={t(`Call ${company.contact_phone}`, `התקשרו ${company.contact_phone}`)}
                >
                  <Phone className="me-2 h-4 w-4" />
                  <span dir="ltr">{company.contact_phone}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
