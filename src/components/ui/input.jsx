import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-11 w-full rounded-[4px] border border-stone-300 bg-white px-3 py-2 text-base text-ink placeholder:text-stone-600 hover:border-stone-400 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 disabled:opacity-50 aria-[invalid=true]:border-red-700",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
