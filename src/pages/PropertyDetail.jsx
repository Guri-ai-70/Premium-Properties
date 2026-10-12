import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Property } from "@/entities/Property";
import { AppSettings } from "@/entities/AppSettings";
import { createPageUrl } from "@/utils";
import { WHATSAPP_NUMBER } from "@/config";
import { useLanguage, usePageTitle } from "@/components/LanguageContext";
import StatusBadges from "@/components/StatusBadges";
import { formatPrice, displayPhone, telHref, sizedImage, imageSrcSet } from "@/lib/utils";
import {
  getRooms,
  hasRooms,
  formatFloor,
  FEATURES,
  propertyTypeLabel,
  PLACEHOLDER_IMAGE,
} from "@/lib/propertyFeatures";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2";

// Initials for the advisor monogram ("דנה אלון" -> "דא", "Dana Alon" -> "DA").
function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function BackLink({ t }) {
  return (
    <Link
      to={createPageUrl("Properties")}
      className={`inline-flex min-h-11 items-center gap-2 rounded-[4px] text-[15px] font-medium text-stone-600 hover:text-ink ${focusRing}`}
    >
      <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
      {t("All properties", "כל הנכסים")}
    </Link>
  );
}

// WhatsApp: a real link once WHATSAPP_NUMBER is set in config.js; until then a
// placeholder button that opens nothing and says the number is coming.
function WhatsAppButton({ t, title, className, onPlaceholder }) {
  const content = (
    <>
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      {t("WhatsApp", "וואטסאפ")}
    </>
  );
  if (WHATSAPP_NUMBER) {
    const text = encodeURIComponent(t(`Hi, I'm interested in: ${title}`, `שלום, אני מתעניין/ת בנכס: ${title}`));
    return (
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onPlaceholder} className={className}>
      {content}
    </button>
  );
}

export default function PropertyDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { language } = useLanguage();
  const t = (en, he) => (language === "he" ? he : en);

  const [property, setProperty] = useState(null);
  const [company, setCompany] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [whatsAppNote, setWhatsAppNote] = useState(false);

  useEffect(() => {
    (async () => {
      const [p, settings] = await Promise.all([
        Property.get(id),
        AppSettings.filter({ key: "company_details" }),
      ]);
      setProperty(p);
      setCompany(settings[0]?.value || null);
      setActiveImage(0);
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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-11 w-32 bg-stone-200" />
        <div className="mt-4 space-y-3 border-b border-stone-300 pb-8">
          <Skeleton className="h-6 w-40 bg-stone-200" />
          <Skeleton className="h-12 w-2/3 bg-stone-200" />
          <Skeleton className="h-5 w-1/3 bg-stone-200" />
        </div>
        <Skeleton className="mt-8 aspect-[4/3] w-full rounded-[4px] bg-stone-200 lg:aspect-[16/9]" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-bold text-ink">
          {t("Property not found", "הנכס לא נמצא")}
        </h1>
        <p className="mt-3 text-lg text-stone-600">
          {t("It may have been sold, rented or removed.", "ייתכן שהנכס נמכר, הושכר או הוסר.")}
        </p>
        <Link
          to={createPageUrl("Properties")}
          className={`mt-8 inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-ink px-6 font-semibold text-white hover:bg-ink-soft ${focusRing}`}
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          {t("Back to all properties", "חזרה לכל הנכסים")}
        </Link>
      </div>
    );
  }

  const title = t(property.title, property.title_he || property.title);
  const description = t(property.description, property.description_he || property.description);
  const city = t(property.city, property.city_he || property.city);
  const address = t(property.address, property.address_he || property.address);
  const typeLabel = propertyTypeLabel(property.property_type, language);
  const images = property.images?.length ? property.images : [PLACEHOLDER_IMAGE];
  const current = Math.min(activeImage, images.length - 1);
  const go = (delta) => setActiveImage((i) => (i + delta + images.length) % images.length);

  const rooms = hasRooms(property) ? getRooms(property) : null;
  const floor = formatFloor(property, language);
  const parking = Number(property.parking) || 0;
  const facts = [
    { label: t("Type", "סוג נכס"), value: typeLabel },
    rooms !== null && { label: t("Rooms", "חדרים"), value: rooms },
    { label: t("Bathrooms", "חדרי רחצה"), value: property.bathrooms },
    { label: t("Area", "שטח"), value: t(`${property.area} m²`, `${property.area} מ"ר`) },
    floor && { label: t("Floor", "קומה"), value: floor },
    parking > 0 && { label: t("Parking", "חניה"), value: parking },
  ].filter(Boolean);
  const features = FEATURES.filter((f) => property[f.key]);

  const agent = company?.agent;
  const agentName = agent ? t(agent.name, agent.name_he) : null;
  const phoneShown = company ? displayPhone(company.contact_phone, language) : null;

  const callClass = `inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[4px] px-4 text-base font-semibold ${focusRing}`;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <BackLink t={t} />

      {/* Header: what, where, how much */}
      <header className="mt-3 grid gap-6 border-b border-stone-300 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-1.5">
            <StatusBadges property={property} showFeatured />
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] text-ink [text-wrap:balance] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-lg text-stone-600">
            <MapPin className="h-5 w-5 shrink-0 text-brass" aria-hidden="true" />
            {address}, {city}
          </p>
        </div>
        <div className="lg:text-end">
          <p className="text-[15px] text-stone-600">
            {property.listing_type === "rent" ? t("Monthly rent", "שכר דירה חודשי") : t("Asking price", "מחיר מבוקש")}
          </p>
          <p className="mt-1 text-4xl font-semibold tabular-nums text-ink sm:text-5xl">
            {formatPrice(property.price, property.currency, property.listing_type === "rent" ? "sale" : property.listing_type, language)}
          </p>
        </div>
      </header>

      {/* Gallery */}
      <section aria-label={t("Photos", "תמונות")} className="mt-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-stone-200 lg:aspect-[16/9]">
          <img
            key={images[current]}
            src={sizedImage(images[current], 1600)}
            srcSet={imageSrcSet(images[current], [800, 1200, 1600, 2400])}
            sizes="(min-width: 1280px) 1216px, 100vw"
            alt={t(`${title}, photo ${current + 1} of ${images.length}`, `${title}, תמונה ${current + 1} מתוך ${images.length}`)}
            className="h-full w-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={t("Previous photo", "התמונה הקודמת")}
                className={`absolute start-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-white transition-colors hover:bg-ink ${focusRing}`}
              >
                <ChevronLeft className="h-6 w-6 rtl:-scale-x-100" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={t("Next photo", "התמונה הבאה")}
                className={`absolute end-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-white transition-colors hover:bg-ink ${focusRing}`}
              >
                <ChevronRight className="h-6 w-6 rtl:-scale-x-100" aria-hidden="true" />
              </button>
              <p
                className="absolute bottom-3 end-3 rounded-[2px] bg-ink/75 px-2.5 py-0.5 text-[13px] font-semibold tabular-nums text-white"
                aria-live="polite"
              >
                <span dir="ltr">{current + 1} / {images.length}</span>
              </p>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={t(`Show photo ${i + 1} of ${images.length}`, `הצגת תמונה ${i + 1} מתוך ${images.length}`)}
                aria-pressed={i === current}
                className={`h-20 w-28 shrink-0 overflow-hidden rounded-[4px] ring-2 ring-offset-2 ring-offset-stone-100 transition ${
                  i === current ? "ring-brass" : "ring-transparent opacity-75 hover:opacity-100"
                } ${focusRing}`}
              >
                <img src={sizedImage(img, 240)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Facts as one measured row */}
      <dl className="mt-10 grid grid-cols-2 gap-x-6 border-y border-stone-300 py-2 sm:grid-cols-3 lg:grid-cols-6">
        {facts.map((f, i) => (
          <div key={i} className="py-4">
            <dt className="text-[15px] text-stone-600">{f.label}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 grid gap-12 pb-16 lg:grid-cols-[1fr_380px] lg:gap-16 lg:pb-24">
        {/* Description and features */}
        <div>
          <h2 className="font-display text-3xl font-bold text-ink">{t("About the property", "על הנכס")}</h2>
          <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-stone-700">{description}</p>

          {features.length > 0 && (
            <>
              <h2 className="mt-12 font-display text-3xl font-bold text-ink">{t("Features", "מאפיינים")}</h2>
              <ul className="mt-5 grid max-w-2xl gap-x-8 gap-y-4 sm:grid-cols-2">
                {features.map((f) => (
                  <li key={f.key} className="flex items-center gap-3 text-lg text-ink">
                    <f.icon className="h-5 w-5 shrink-0 text-brass" aria-hidden="true" />
                    {t(f.en, f.he)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Contact: the one ink block on the page */}
        {company && (
          <aside aria-labelledby="contact-heading" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[4px] bg-ink p-6 text-stone-200 sm:p-8">
              <h2 id="contact-heading" className="font-display text-2xl font-bold text-white">
                {t("Interested in this property?", "מעוניינים בנכס?")}
              </h2>
              {agent && (
                <div className="mt-6 flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brass font-display text-xl font-bold text-ink"
                  >
                    {initials(agentName)}
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-white">{agentName}</p>
                    <p className="text-stone-400">{t(agent.role, agent.role_he)}</p>
                  </div>
                </div>
              )}
              <div className="mt-6 grid gap-3">
                <a
                  href={telHref(company.contact_phone)}
                  aria-label={t(`Call ${phoneShown}`, `התקשרו ${phoneShown}`)}
                  className={`${callClass} bg-white text-ink hover:bg-stone-100 focus-visible:ring-offset-ink`}
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  <span dir="ltr" className="tabular-nums">{phoneShown}</span>
                </a>
                <WhatsAppButton
                  t={t}
                  title={title}
                  onPlaceholder={() => setWhatsAppNote(true)}
                  className={`${callClass} text-white ring-1 ring-inset ring-stone-500 hover:bg-ink-soft focus-visible:ring-offset-ink`}
                />
                <p aria-live="polite" className="text-sm text-stone-400 empty:hidden">
                  {whatsAppNote &&
                    t(
                      "WhatsApp is coming soon. Meanwhile, call or send an email.",
                      "וואטסאפ יתווסף בקרוב. בינתיים אפשר להתקשר או לשלוח אימייל."
                    )}
                </p>
                <a
                  href={`mailto:${company.contact_email}?subject=${encodeURIComponent(title)}`}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] text-[15px] text-stone-300 underline decoration-stone-600 underline-offset-4 hover:text-white hover:decoration-brass-light ${focusRing} focus-visible:ring-offset-ink`}
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {t("Send an email", "שליחת אימייל")}
                </a>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Mobile: call and WhatsApp stay in reach; the bar stops at the end of the page */}
      {company && (
        <div className="sticky bottom-0 z-40 -mx-4 border-t border-stone-300 bg-stone-100/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:hidden">
          <div className="flex gap-3">
            <a
              href={telHref(company.contact_phone)}
              aria-label={t(`Call ${phoneShown}`, `התקשרו ${phoneShown}`)}
              className={`${callClass} bg-ink text-white`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {t("Call", "התקשרו")}
            </a>
            <WhatsAppButton
              t={t}
              title={title}
              onPlaceholder={() => {
                setWhatsAppNote(true);
                document.getElementById("contact-heading")?.scrollIntoView({ block: "center" });
              }}
              className={`${callClass} bg-white text-ink ring-1 ring-inset ring-stone-300`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
