import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/components/LanguageContext";
import { formatPrice, sizedImage, imageSrcSet } from "@/lib/utils";
import { getRooms, hasRooms } from "@/lib/propertyFeatures";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80";

const typeLabels = {
  apartment: { en: "Apartment", he: "דירה" },
  garden_apartment: { en: "Garden Apartment", he: "דירת גן" },
  duplex: { en: "Duplex", he: "דופלקס" },
  penthouse: { en: "Penthouse", he: "פנטהאוז" },
  mini_penthouse: { en: "Mini Penthouse", he: "מיני פנטהאוז" },
  house: { en: "House", he: "בית" },
  villa: { en: "Villa", he: "וילה" },
  commercial: { en: "Commercial", he: "מסחרי" },
  plot: { en: "Plot", he: "מגרש" },
};

export default function PropertyCard({ property }) {
  const { language } = useLanguage();
  const t = (en, he) => (language === "he" ? he : en);

  const title = t(property.title, property.title_he || property.title);
  const city = t(property.city, property.city_he || property.city);
  const image = property.images?.[0] || PLACEHOLDER;
  const typeLabel =
    typeLabels[property.property_type]?.[language] || property.property_type;
  const deal = property.listing_type === "rent" ? t("For rent", "להשכרה") : t("For sale", "למכירה");

  const rooms = hasRooms(property) ? getRooms(property) : null;
  const baths = Number(property.bathrooms) || 0;
  const facts = [
    rooms !== null && t(`${rooms} rooms`, `${rooms} חדרים`),
    baths > 0 &&
      (baths === 1 ? t("1 bath", "חדר רחצה") : t(`${baths} baths`, `${baths} חדרי רחצה`)),
    property.area && t(`${property.area} m²`, `${property.area} מ"ר`),
  ].filter(Boolean);

  return (
    <Link
      to={createPageUrl(`PropertyDetail?id=${property.id}`)}
      className="group block rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-4 focus-visible:ring-offset-stone-100"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-stone-200">
        <img
          src={sizedImage(image, 800)}
          srcSet={imageSrcSet(image, [480, 800, 1200])}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {property.exclusive && (
          <span className="absolute start-3 top-3 rounded-[2px] bg-brass-dark px-2.5 py-1 text-[13px] font-semibold text-white shadow-sm">
            {t("Exclusive", "בבלעדיות")}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-[15px] text-stone-600">
          <span className="font-semibold text-ink">{deal}</span>
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {typeLabel}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {city}
        </p>
        <h3 className="mt-1.5 line-clamp-1 font-display text-[22px] font-bold leading-snug text-ink decoration-brass decoration-1 underline-offset-[6px] group-hover:underline">
          {title}
        </h3>
        <p className="mt-2 text-lg font-semibold tabular-nums text-ink">
          {formatPrice(property.price, property.currency, property.listing_type, language)}
        </p>
        {facts.length > 0 && (
          <p className="mt-1.5 text-[15px] tabular-nums text-stone-600">
            {facts.map((f, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span aria-hidden="true" className="mx-1.5 text-stone-400">·</span>}
                {i > 0 && <span className="sr-only">, </span>}
                {f}
              </React.Fragment>
            ))}
          </p>
        )}
      </div>
    </Link>
  );
}
