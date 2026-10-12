import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui className combiner.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Unsplash URLs take a width parameter; ask for the size actually shown
// instead of always downloading the 1200px original. Other URLs pass through.
export function sizedImage(url, width) {
  if (!url || !url.includes("images.unsplash.com")) return url;
  return /[?&]w=\d+/.test(url)
    ? url.replace(/([?&]w=)\d+/, `$1${width}`)
    : `${url}${url.includes("?") ? "&" : "?"}w=${width}`;
}

export function imageSrcSet(url, widths = [480, 800, 1200]) {
  if (!url || !url.includes("images.unsplash.com")) return undefined;
  return widths.map((w) => `${sizedImage(url, w)} ${w}w`).join(", ");
}

// Israeli numbers stored as "+972 3-555-0199" display locally as "03-555-0199"
// in Hebrew. The tel: link keeps the stored international form.
export function displayPhone(phone, lang = "en") {
  if (!phone || lang !== "he") return phone;
  return phone.replace(/^\+972[\s-]?/, "0");
}

// Maps the stored currency symbol to an ISO code for Intl.
const CURRENCY_CODES = { "₪": "ILS", ILS: "ILS", $: "USD", USD: "USD", "€": "EUR", EUR: "EUR" };

// Formats a price the way each language expects:
//   Hebrew:  8,500,000 ₪   /  9,500 ₪ לחודש   (Israeli convention, symbol after)
//   English: ₪8,500,000    /  ₪9,500 / mo
// Intl adds invisible direction marks so the ₪ stays put inside RTL text.
export function formatPrice(value, currency = "₪", listingType, lang = "en") {
  const amount = Number(value || 0);
  const code = CURRENCY_CODES[currency];
  const formatted = code
    ? new Intl.NumberFormat(lang === "he" ? "he-IL" : "en-US", {
        style: "currency",
        currency: code,
        maximumFractionDigits: 0,
      }).format(amount)
    : `${currency}${amount.toLocaleString("en-US")}`;
  if (listingType === "rent") {
    return lang === "he" ? `${formatted} לחודש` : `${formatted} / mo`;
  }
  return formatted;
}
