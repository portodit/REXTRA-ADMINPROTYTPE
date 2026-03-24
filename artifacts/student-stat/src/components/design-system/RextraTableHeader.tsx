import React from "react";

interface RextraTableHeaderProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export function RextraTableHeader({ title, subtitle, actions }: RextraTableHeaderProps) {
  return (
    <div className="flex flex-col gap-5 p-5 sm:p-6">
      {/* Title & Subtitle */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>

      {/* Action buttons row */}
      {actions && (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
