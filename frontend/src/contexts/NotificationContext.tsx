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
}

interface NotificationContextType {
    notifications: NotificationItem[];
    unreadCount: number;
    showNotification: (message: string, type: 'success' | 'error' | 'warning' | 'info', action?: string, bookTitle?: string, autoHide?: boolean) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
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

    const showNotification = (
        message: string, 
        type: 'success' | 'error' | 'warning' | 'info', 
        action?: string, 
        bookTitle?: string,
        autoHide: boolean = true
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
            autoHide
        };
        
        setNotifications(prev => [newNotification, ...prev]);

        // Auto-remove only toast notifications after 5 seconds
        if (autoHide) {
            setTimeout(() => {
                removeNotification(id);
            }, 5000);
        }
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
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read && n.autoHide === false).length;

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount,
            showNotification, 
            markAsRead, 
            markAllAsRead, 
            removeNotification, 
            clearAllNotifications 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
