import { createContext, useContext, useState, type ReactNode } from 'react';

export interface NotificationItem {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    timestamp: Date;
    read: boolean;
    action?: string; // e.g., 'borrowed', 'returned', 'reserved', 'cancelled'
    bookTitle?: string;
    autoHide?: boolean;
    showPopup?: boolean; // New field for popup notifications
}

interface NotificationContextType {
    notifications: NotificationItem[];
    unreadCount: number;
    popupNotification: NotificationItem | null;
    showNotification: (message: string, type: 'success' | 'error' | 'warning' | 'info', action?: string, bookTitle?: string, autoHide?: boolean, showPopup?: boolean) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
    closePopup: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [popupNotification, setPopupNotification] = useState<NotificationItem | null>(null);

    const showNotification = (
        message: string, 
        type: 'success' | 'error' | 'warning' | 'info', 
        action?: string, 
        bookTitle?: string,
        autoHide: boolean = true,
        showPopup: boolean = false
    ) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNotification: NotificationItem = {
            id,
            message,
            type,
            timestamp: new Date(),
            read: false,
            action,
            bookTitle,
            autoHide,
            showPopup
        };
        
        // Add to notifications list
        setNotifications(prev => [newNotification, ...prev]);

        // Show popup if requested
        if (showPopup) {
            setPopupNotification(newNotification);
        }

        // Auto-remove only toast notifications after 5 seconds
        if (autoHide) {
            setTimeout(() => {
                removeNotification(id);
            }, 5000);
        }
    };

    const closePopup = () => {
        setPopupNotification(null);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === id 
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        
        // Close popup if it's the same notification being removed
        if (popupNotification?.id === id) {
            setPopupNotification(null);
        }
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        setPopupNotification(null);
    };

    const unreadCount = notifications.filter(n => !n.read && n.autoHide === false).length;

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount,
            popupNotification,
            showNotification, 
            markAsRead, 
            markAllAsRead, 
            removeNotification, 
            clearAllNotifications,
            closePopup
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
