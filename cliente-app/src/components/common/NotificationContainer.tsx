import { useNotification } from '../../contexts/NotificationContext';
import { Alert } from './Alert';
import './NotificationContainer.css';

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Alert key={notification.id} notification={notification} onClose={removeNotification} />
      ))}
    </div>
  );
}
