import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

// A small dependency-free dropdown that matches the shadcn/Radix API surface
// used in the app (DropdownMenu / Trigger / Content / Item).
const DropdownContext = createContext(null);

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, children }) {
  const { open, setOpen } = useContext(DropdownContext);
  const toggle = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: toggle });
  }
  return (
    <button type="button" onClick={toggle}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ align = "start", className, children }) {
  const { open } = useContext(DropdownContext);
  if (!open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-[10rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 shadow-lg",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ className, onClick, children }) {
  const { setOpen } = useContext(DropdownContext);
  const handle = (e) => {
    onClick?.(e);
    setOpen(false);
  };
  return (
    <button
      type="button"
      onClick={handle}
      className={cn(
        "flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm text-slate-700 hover:bg-slate-100",
        className
      )}
    >
      {children}
    </button>
  );
}
