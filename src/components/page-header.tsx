import { type ReactNode } from "react";

export function PageHeader({
  module,
  title,
  description,
  actions,
}: {
  module: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-primary/70">
          {module}
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
