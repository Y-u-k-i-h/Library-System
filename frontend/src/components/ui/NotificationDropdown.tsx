import { useState, useRef, useEffect } from 'react';
import { useNotification, type NotificationItem } from '../../contexts/NotificationContext';
import notificationIcon from '../../assets/dashboard-assets/notification.svg';
import './notification-dropdown.css';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, markAsRead, removeNotification, clearAllNotifications } = useNotification();

    // Only show persistent notifications in dropdown (not auto-hide ones)
    const persistentNotifications = notifications.filter(n => n.autoHide === false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen && persistentNotifications.some(n => !n.read)) {
            // Mark all persistent notifications as read when opening the dropdown
            setTimeout(() => {
                persistentNotifications.forEach(n => {
                    if (!n.read) markAsRead(n.id);
                });
            }, 500);
        }
    };

    const handleNotificationClick = (notification: NotificationItem) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'warning': return '⚠';
            case 'info': return 'ℹ';
            default: return '•';
        }
    };

    const getActionIcon = (action?: string) => {
        switch (action) {
            case 'borrowed': return '📚';
            case 'returned': return '↩';
            case 'reserved': return '🔖';
            case 'cancelled': return '❌';
            default: return '';
        }
    };

    const formatTimestamp = (timestamp: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - timestamp.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return timestamp.toLocaleDateString();
    };

    return (
        <div className="notification-dropdown" ref={dropdownRef}>
            <button 
                className="notification-bell"
                onClick={toggleDropdown}
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            >
                <img 
                    src={notificationIcon} 
                    alt="Notifications" 
                    className="bell-icon"
                />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown-menu">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {persistentNotifications.length > 0 && (
                            <button 
                                className="clear-all-btn"
                                onClick={clearAllNotifications}
                                title="Clear all notifications"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {persistentNotifications.length === 0 ? (
                            <div className="no-notifications">
                                <span className="no-notifications-icon">📭</span>
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            persistentNotifications.slice(0, 10).map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-item-content">
                                        <div className="notification-item-header">
                                            <span className="notification-item-icon">
                                                {getActionIcon(notification.action) || getNotificationIcon(notification.type)}
                                            </span>
                                            <span className="notification-timestamp">
                                                {formatTimestamp(notification.timestamp)}
                                            </span>
                                            <button
                                                className="remove-notification-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeNotification(notification.id);
                                                }}
                                                title="Remove notification"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <div className="notification-item-message">
                                            {notification.message}
                                        </div>
                                        {notification.bookTitle && (
                                            <div className="notification-item-book">
                                                <strong>{notification.bookTitle}</strong>
                                            </div>
                                        )}
                                        {!notification.read && (
                                            <div className="unread-indicator"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {persistentNotifications.length > 10 && (
                        <div className="notification-footer">
                            <p>{persistentNotifications.length - 10} more notifications...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
