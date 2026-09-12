import React from 'react';

export type StatusVariant = 'online' | 'offline' | 'warning' | 'simulating';

export interface StatusIndicatorProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusVariant, { dot: string; pulse: string; text: string }> = {
  online: {
    dot: 'bg-emerald-500',
    pulse: 'bg-emerald-500/50',
    text: 'text-emerald-500',
  },
  offline: {
    dot: 'bg-rose-500',
    pulse: 'bg-rose-500/50',
    text: 'text-rose-500',
  },
  warning: {
    dot: 'bg-amber-500',
    pulse: 'bg-amber-500/50',
    text: 'text-amber-500',
  },
  simulating: {
    dot: 'bg-gradient-to-r from-purple-500 to-cyan-500',
    pulse: 'bg-purple-500/50', // Simplified pulse for gradient
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500',
  },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, className = '' }) => {
  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      role="status"
      aria-label={label ? `${label}: ${status}` : `Status: ${status}`}
    >
      <div className="relative flex h-2.5 w-2.5 items-center justify-center">
        {status !== 'offline' && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.pulse}`}
          />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${config.dot}`} />
      </div>
      {label && (
        <span className={`text-sm font-medium ${config.text}`}>
          {label}
        </span>
      )}
    </div>
  );
};
