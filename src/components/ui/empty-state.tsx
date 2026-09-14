import * as React from "react";
import { FolderSearch } from "lucide-react";
import { Button } from "./button";

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-[#C4D1CA] bg-[#F4F8F5]/50 ${
        className || ""
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-[#E8F4EC] flex items-center justify-center text-[#2F7D4A] mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#17201B] mb-1">{title}</h3>
      <p className="text-sm text-[#64706A] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
