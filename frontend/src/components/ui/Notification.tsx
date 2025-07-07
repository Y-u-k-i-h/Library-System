import { useEffect, useState } from 'react';
import './notification.css';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export default function Notification({ message, type, isVisible, onClose, duration = 4000 }: NotificationProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for animation to complete
    };

    if (!isVisible) return null;

    return (
        <div className={`notification ${type} ${isAnimating ? 'notification-enter' : 'notification-exit'}`}>
            <div className="notification-content">
                <div className="notification-icon">
                    {type === 'success' && '✓'}
                    {type === 'error' && '✕'}
                    {type === 'warning' && '⚠'}
                    {type === 'info' && 'ℹ'}
                </div>
                <div className="notification-message">{message}</div>
                <button className="notification-close" onClick={handleClose}>
                    ×
                </button>
            </div>
        </div>
    );
}
