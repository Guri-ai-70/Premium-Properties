import React from "react";
import { cn } from "@/lib/utils";

// Same frame as the listing status badges (StatusBadges); text is always ≥4.5:1.
const styles = {
  default: "bg-ink text-white",
  secondary: "bg-stone-200 text-stone-700",
  success: "bg-olive text-white",
  warning: "bg-stone-200 text-ink",
  outline: "text-stone-700 ring-1 ring-inset ring-stone-400",
  exclusive: "bg-brass-dark text-white",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[2px] px-2.5 py-0.5 text-[13px] font-semibold leading-5",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
