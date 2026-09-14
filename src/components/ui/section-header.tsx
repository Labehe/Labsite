import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-4 mb-12",
        align === "center" && "items-center text-center max-w-4xl mx-auto",
        align === "left" && "max-w-4xl",
        className
      )}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30">
          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-mono-scientific text-xs uppercase tracking-[0.2em] text-[#34D399] font-bold">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FFFFFF] font-display-hero">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg lg:text-xl text-[#94A3B8] leading-relaxed max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
}
