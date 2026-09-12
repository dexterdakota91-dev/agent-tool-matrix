'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    styles: 'bg-zinc-950 border-green-500/50 text-green-50 shadow-[0_0_15px_rgba(34,197,94,0.2)]',
    iconStyles: 'text-green-500',
    role: 'status',
    ariaLive: 'polite' as const,
  },
  error: {
    icon: AlertCircle,
    styles: 'bg-zinc-950 border-red-500/50 text-red-50 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    iconStyles: 'text-red-500',
    role: 'alert',
    ariaLive: 'assertive' as const,
  },
  warning: {
    icon: AlertTriangle,
    styles: 'bg-zinc-950 border-yellow-500/50 text-yellow-50 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
    iconStyles: 'text-yellow-500',
    role: 'alert',
    ariaLive: 'assertive' as const,
  },
  info: {
    icon: Info,
    styles: 'bg-zinc-950 border-cyan-500/50 text-cyan-50 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    iconStyles: 'text-cyan-500',
    role: 'status',
    ariaLive: 'polite' as const,
  },
};

export function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose(id), 300); // Matches transition duration
  }, [id, onClose]);

  useEffect(() => {
    // Trigger entrance animation
    const mountTimer = setTimeout(() => setIsMounted(true), 10);

    let closeTimer: ReturnType<typeof setTimeout>;
    if (duration > 0) {
      closeTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(mountTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [duration, id, handleClose]);

  const config = toastConfig[type];
  const Icon = config.icon;

  const animationClasses = isClosing
    ? 'opacity-0 translate-x-8 scale-95'
    : isMounted
      ? 'opacity-100 translate-x-0 scale-100'
      : 'opacity-0 translate-x-8 scale-95';

  return (
    <div
      className={`flex items-start p-4 mb-3 border rounded-lg transition-all duration-300 ease-in-out transform backdrop-blur-md ${animationClasses} ${config.styles}`}
      role={config.role}
      aria-live={config.ariaLive}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`w-5 h-5 ${config.iconStyles}`} aria-hidden="true" />
      </div>
      <div className="ml-3 mr-8 flex-1">
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 ml-auto -mx-1.5 -my-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md p-1.5 focus:ring-2 focus:ring-zinc-400 focus:outline-none transition-colors"
        aria-label="Close notification"
      >
        <span className="sr-only">Close</span>
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onClose'>[];
  onCloseToast: (id: string) => void;
  position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'top-center' | 'bottom-center';
}

const positionClasses = {
  'bottom-right': 'bottom-4 right-4 items-end',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

export function ToastContainer({ toasts, onCloseToast, position = 'bottom-right' }: ToastContainerProps) {
  return (
    <div className={`fixed z-50 w-full max-w-sm pointer-events-none flex flex-col ${positionClasses[position]}`}>
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full">
          <Toast {...toast} onClose={onCloseToast} />
        </div>
      ))}
    </div>
  );
}
