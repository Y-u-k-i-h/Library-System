import { useEffect, useState } from 'react';
import './notification-popup.css';

interface NotificationPopupProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
    onClose: () => void;
    duration?: number; // Auto-close duration in milliseconds
}

export default function NotificationPopup({ 
    message, 
    type, 
    isVisible, 
    onClose, 
    duration = 4000 
}: NotificationPopupProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            
            // Auto-close timer
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
        }, 300); // Wait for fade-out animation
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return 'ℹ';
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`notification-popup-overlay ${isAnimating ? 'show' : ''}`}>
            <div className={`notification-popup ${type} ${isAnimating ? 'slide-in' : 'slide-out'}`}>
                <div className="notification-popup-content">
                    <div className="notification-popup-icon">
                        {getIcon()}
                    </div>
                    <div className="notification-popup-message">
                        {message}
                    </div>
                    <button 
                        className="notification-popup-close"
                        onClick={handleClose}
                        aria-label="Close notification"
                    >
                        ×
                    </button>
                </div>
                <div className={`notification-popup-progress ${type}`}></div>
            </div>
        </div>
    );
}
