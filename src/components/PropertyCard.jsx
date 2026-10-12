import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/components/LanguageContext";
import { formatPrice, sizedImage, imageSrcSet } from "@/lib/utils";
import { getRooms, hasRooms, propertyTypeLabel, PLACEHOLDER_IMAGE } from "@/lib/propertyFeatures";
import StatusBadges from "@/components/StatusBadges";

export default function PropertyCard({ property }) {
  const { language } = useLanguage();
  const t = (en, he) => (language === "he" ? he : en);

  const title = t(property.title, property.title_he || property.title);
  const city = t(property.city, property.city_he || property.city);
  const image = property.images?.[0] || PLACEHOLDER_IMAGE;
  const typeLabel = propertyTypeLabel(property.property_type, language);

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
        <div className="absolute start-3 top-3 flex flex-wrap gap-1.5">
          <StatusBadges property={property} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[15px] text-stone-600">
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
