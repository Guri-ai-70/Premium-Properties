import React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }) {
  return (
    <label
      className={cn("text-[15px] font-medium text-stone-700", className)}
      {...props}
    />
  );
}
