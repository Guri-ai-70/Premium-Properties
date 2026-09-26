import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui className combiner.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
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
