import React, { createContext, ReactNode, useContext, useRef, useState } from 'react';

export type ToastType = 'success' | 'info' | 'error';

interface Toast {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: Toast | null;
  showToast: (message: string, type?: ToastType) => void;
}

const TOAST_DURATION_MS = 2800;

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    // Restart the timer so a new toast isn't hidden early by the previous one's timeout
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setToast({ message, type });
    hideTimer.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  };

  return <ToastContext.Provider value={{ toast, showToast }}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
