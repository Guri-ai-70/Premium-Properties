import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-[15px] font-semibold [transition:background-color_150ms_ease,color_150ms_ease,border-color_150ms_ease,transform_160ms_cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-ink text-white hover:bg-ink-soft",
        outline:
          "border border-stone-300 bg-white text-ink hover:border-stone-400 hover:bg-stone-50",
        ghost: "text-stone-700 hover:bg-stone-200/60 hover:text-ink",
        destructive: "bg-red-700 text-white hover:bg-red-800",
        secondary: "bg-stone-200 text-ink hover:bg-stone-300",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-10 px-3",
        lg: "h-12 px-6",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
