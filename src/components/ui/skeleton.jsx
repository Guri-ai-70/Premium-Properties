import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-[4px] bg-stone-200 motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
