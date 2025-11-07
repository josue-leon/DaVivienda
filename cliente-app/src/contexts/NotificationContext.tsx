import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: NotificationType, message: string, title?: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_DURATION = 10000; // 10 segundos por defecto

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (type: NotificationType, message: string, title?: string, duration: number = DEFAULT_DURATION) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = { id, type, message, title };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remover después de la duración especificada
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
