import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Property } from "@/entities/Property";
import { AppSettings } from "@/entities/AppSettings";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/components/LanguageContext";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bed,
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

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">
        {t("Loading...", "טוען...")}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          {t("Property not found", "הנכס לא נמצא")}
        </h1>
        <Link to={createPageUrl("Properties")} className="mt-4 inline-block">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("Back to Properties", "חזרה לנכסים")}
          </Button>
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

  const facts = [
    property.property_type !== "commercial" &&
      property.property_type !== "land" && {
        icon: Bed,
        label: t("Bedrooms", "חדרי שינה"),
        value: property.bedrooms,
      },
    { icon: Bath, label: t("Bathrooms", "חדרי רחצה"), value: property.bathrooms },
    { icon: Maximize, label: t("Area", "שטח"), value: `${property.area} m²` },
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={createPageUrl("Properties")}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("Back to Properties", "חזרה לנכסים")}
        </Button>
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
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-28 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? "border-blue-600" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              {t("Description", "תיאור")}
            </h2>
            <p className="leading-relaxed text-slate-600">{description}</p>
          </div>
        </div>

        {/* Summary card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant={property.listing_type === "rent" ? "warning" : "default"}>
                {property.listing_type === "rent" ? t("For Rent", "להשכרה") : t("For Sale", "למכירה")}
              </Badge>
              {property.exclusive && <Badge variant="exclusive">{t("Exclusive", "בבלעדיות")}</Badge>}
              {property.featured && <Badge variant="success">{t("Featured", "מומלץ")}</Badge>}
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {address}, {city}
            </p>

            <p className="mt-4 text-3xl font-extrabold text-blue-700">
              {formatPrice(property.price, property.currency, property.listing_type, language)}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {facts.map((f, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-3 text-center">
                  <f.icon className="mx-auto mb-1 h-5 w-5 text-blue-600" />
                  <div className="text-sm font-bold text-slate-900">{f.value}</div>
                  <div className="text-xs text-slate-500">{f.label}</div>
                </div>
              ))}
            </div>

            {company && (
              <div className="mt-6 border-t border-slate-100 pt-6">
                <h3 className="mb-3 font-semibold text-slate-900">
                  {t("Interested? Get in touch", "מעוניינים? צרו קשר")}
                </h3>
                <a href={`mailto:${company.contact_email}`}>
                  <Button className="mb-2 w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    {t("Email Agent", "שלחו אימייל")}
                  </Button>
                </a>
                <a href={`tel:${company.contact_phone}`}>
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    {company.contact_phone}
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
