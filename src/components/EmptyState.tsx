"use client";

import * as React from "react";
import Link from "next/link";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <section
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl backdrop-blur-md bg-zinc-950/75 dark:bg-zinc-900/80 border border-white/10 shadow-md ${className}`}
      aria-labelledby="empty-state-title"
    >
      {icon && (
        <div className="mb-4 text-foreground/80 flex items-center justify-center" aria-hidden="true">
          {icon}
        </div>
      )}
      <h2
        id="empty-state-title"
        className="text-lg font-bold text-foreground tracking-tight mb-2"
      >
        {title}
      </h2>
      {description && (
        <p className="text-sm text-foreground/80 max-w-md mx-auto mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-2">
          {action.href ? (
            <Link
              href={action.href}
              onClick={action.onClick}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-600/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 cursor-pointer"
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-600/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 cursor-pointer"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default EmptyState;
