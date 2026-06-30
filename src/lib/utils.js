import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui className combiner.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Formats a price for sale (₪8,500,000) or rent (₪9,500 / mo).
export function formatPrice(value, currency = "₪", listingType, lang = "en") {
  const formatted = `${currency}${Number(value || 0).toLocaleString("en-US")}`;
  if (listingType === "rent") {
    return lang === "he" ? `${formatted} / חודש` : `${formatted} / mo`;
  }
  return formatted;
}
