import React from "react";
import { cn } from "@/lib/utils";

const styles = {
  default: "bg-primary text-white",
  secondary: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  outline: "border border-slate-300 text-slate-700",
  exclusive:
    "bg-gradient-to-r from-accent-gold to-accent-gold-light text-white shadow-sm",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
