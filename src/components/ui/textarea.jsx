import React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[120px] w-full rounded-[4px] border border-stone-300 bg-white px-3 py-2 text-base leading-relaxed text-ink placeholder:text-stone-500 hover:border-stone-400 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 disabled:opacity-50 aria-[invalid=true]:border-red-700",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
