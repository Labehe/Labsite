import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "emerald"
    | "teal"
    | "citron"
    | "forest"
    | "outline"
    | "scientific"
    | "neutral";
  size?: "sm" | "md" | "lg";
}

export function Badge({
  className,
  variant = "emerald",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-bold transition-all select-none rounded-md";

  const variantStyles = {
    emerald:
      "bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30",
    teal:
      "bg-[#14B8A6]/15 text-[#2DD4BF] border border-[#14B8A6]/30",
    citron:
      "bg-[#A3E635]/15 text-[#BEF264] border border-[#A3E635]/40",
    forest:
      "bg-[#0D3823] text-[#A7F3D0] border border-[#185235]",
    outline:
      "border border-[#185235] text-[#94A3B8] bg-[#072214]/60",
    scientific:
      "font-mono-scientific bg-[#14B8A6]/10 text-[#2DD4BF] border border-[#14B8A6]/30 uppercase tracking-widest text-[11px] font-semibold",
    neutral:
      "bg-[#0B301D] text-[#94A3B8] border border-[#185235]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-xs uppercase tracking-wider font-extrabold",
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}
