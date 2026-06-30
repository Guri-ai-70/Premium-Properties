import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// A native <select> styled to match the rest of the UI. Pass options as
// [{ value, label }] or use children <option> elements.
export const Select = React.forwardRef(
  ({ className, options, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50",
          className
        )}
        {...props}
      >
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          : children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
);
Select.displayName = "Select";
