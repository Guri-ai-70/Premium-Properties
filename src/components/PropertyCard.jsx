import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/components/LanguageContext";
import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80";

const typeLabels = {
  apartment: { en: "Apartment", he: "דירה" },
  house: { en: "House", he: "בית" },
  villa: { en: "Villa", he: "וילה" },
  commercial: { en: "Commercial", he: "מסחרי" },
  land: { en: "Land", he: "קרקע" },
};

export default function PropertyCard({ property }) {
  const { language } = useLanguage();
  const t = (en, he) => (language === "he" ? he : en);

  const title = t(property.title, property.title_he || property.title);
  const city = t(property.city, property.city_he || property.city);
  const image = property.images?.[0] || PLACEHOLDER;
  const typeLabel =
    typeLabels[property.property_type]?.[language] || property.property_type;

  return (
    <Link to={createPageUrl(`PropertyDetail?id=${property.id}`)}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-52 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge variant={property.listing_type === "rent" ? "warning" : "default"}>
              {property.listing_type === "rent" ? t("For Rent", "להשכרה") : t("For Sale", "למכירה")}
            </Badge>
            {property.exclusive && (
              <Badge variant="exclusive">{t("Exclusive", "בבלעדיות")}</Badge>
            )}
            {property.featured && (
              <Badge variant="success">{t("Featured", "מומלץ")}</Badge>
            )}
          </div>
        </div>
        <div className="p-5">
          <div className="mb-1 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            <span>{city}</span>
            <span className="mx-1">•</span>
            <span>{typeLabel}</span>
          </div>
          <h3 className="mb-2 line-clamp-1 text-lg font-bold text-slate-900">
            {title}
          </h3>
          <p className="mb-4 text-xl font-extrabold text-blue-700">
            {formatPrice(property.price, property.currency, property.listing_type, language)}
          </p>
          <div className="flex items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
            {property.property_type !== "commercial" && property.property_type !== "land" && (
              <span className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-slate-400" />
                {property.bedrooms}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-slate-400" />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-slate-400" />
              {property.area} m²
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
