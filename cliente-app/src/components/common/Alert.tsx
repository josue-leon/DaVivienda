import type { Notification, NotificationType } from '../../contexts/NotificationContext';
import './Alert.css';

interface AlertProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const typeStyles: Record<NotificationType, string> = {
  success: 'alert-success',
  error: 'alert-error',
  info: 'alert-info',
  warning: 'alert-warning',
};

const typeIcons: Record<NotificationType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export function Alert({ notification, onClose }: AlertProps) {
  return (
    <div className={`alert ${typeStyles[notification.type]}`}>
      <div className="alert-icon">{typeIcons[notification.type]}</div>
      <div className="alert-content">
        {notification.title && <div className="alert-title">{notification.title}</div>}
        <div className="alert-message">{notification.message}</div>
      </div>
      <button className="alert-close" onClick={() => onClose(notification.id)}>
        ✕
      </button>
    </div>
  );
}
