'use client';

import { toast as sonnerToast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastVariant = 'default' | 'destructive';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function useToast() {
  // Fonction compatible avec l'ancienne API
  const showToast = (message: string, type: ToastType = 'info', duration = 5000) => {
    switch (type) {
      case 'success':
        sonnerToast.success(message, { duration });
        break;
      case 'error':
        sonnerToast.error(message, { duration });
        break;
      case 'warning':
        sonnerToast.warning(message, { duration });
        break;
      case 'info':
      default:
        sonnerToast.info(message, { duration });
        break;
    }
  };

  // Fonction compatible avec la nouvelle API
  const toast = (options: ToastOptions | string, type?: ToastType, duration = 5000) => {
    // Si options est une chaîne, utiliser l'ancienne API
    if (typeof options === 'string') {
      return showToast(options, type, duration);
    }

    // Sinon, utiliser la nouvelle API
    const { title, description, variant = 'default', duration: optionsDuration = 5000 } = options;

    if (variant === 'destructive') {
      return sonnerToast.error(title, {
        description,
        duration: optionsDuration,
      });
    }

    return sonnerToast(title, {
      description,
      duration: optionsDuration,
    });
  };

  return { toast };
}
