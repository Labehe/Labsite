import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "emerald"
    | "outline"
    | "ghost"
    | "scientific"
    | "destructive";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "emerald",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#04150C] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer rounded-lg";

    const variantStyles = {
      emerald:
        "bg-[#14532D] text-white hover:bg-[#166534] shadow-md shadow-emerald-950/15 font-bold uppercase tracking-wider text-xs",
      primary:
        "bg-[#14532D] text-white hover:bg-[#166534] shadow-md shadow-emerald-950/15 font-bold",
      secondary:
        "bg-[#0F766E] text-white hover:bg-[#115E59] shadow-md font-bold",
      outline:
        "border border-[#D8E6DC] dark:border-[#185235] bg-white dark:bg-[#072214]/60 text-[#082817] dark:text-white hover:bg-[#F4F8F5] dark:hover:bg-[#0B301D] hover:border-[#14532D]",
      ghost:
        "bg-transparent text-[#52635A] dark:text-[#94A3B8] hover:bg-[#E8F5EE] dark:hover:bg-[#072214] hover:text-[#14532D] dark:hover:text-[#FFFFFF]",
      scientific:
        "border border-[#0F766E]/40 bg-[#0F766E]/10 text-[#0F766E] dark:text-[#2DD4BF] hover:bg-[#0F766E]/20 font-mono-scientific uppercase tracking-widest text-xs font-semibold",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-2 gap-1.5",
      md: "text-sm px-5 py-3 gap-2",
      lg: "text-base px-7 py-4 gap-2.5 text-sm uppercase font-black",
      xl: "text-lg px-9 py-4.5 gap-3 uppercase font-black tracking-wider",
      icon: "h-11 w-11 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
