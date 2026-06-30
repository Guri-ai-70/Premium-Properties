import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

// A simple centered modal with a dimmed backdrop. Closes on backdrop click
// or Escape. Used for the delete confirmation frame.
export function Modal({ open, onClose, children, className }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
