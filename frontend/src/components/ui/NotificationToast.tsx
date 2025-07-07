import { useNotification } from '../../contexts/NotificationContext';
import Notification from './Notification';
import './notification-toast.css';

export default function NotificationToast() {
    const { notifications, removeNotification } = useNotification();

    // Only show toast notifications that should auto-hide
    const toastNotifications = notifications.filter(n => n.autoHide !== false);

    return (
        <div className="notification-toast-container">
            {toastNotifications.map((notification) => (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    isVisible={true}
                    onClose={() => removeNotification(notification.id)}
                    duration={5000}
                />
            ))}
        </div>
    );
}
