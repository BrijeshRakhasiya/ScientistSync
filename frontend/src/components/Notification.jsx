// Team Member 3: Frontend Developer - Notification Component for Inline Messages
import React, { useState, useEffect } from 'react';

const Notification = ({ type, message, duration = 4000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) {
                setTimeout(onClose, 300); // Allow fade out animation to complete
            }
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getNotificationStyle = () => {
        const baseStyle = {
            padding: '15px 20px',
            borderRadius: '15px',
            marginBottom: '15px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
        };

        switch (type) {
            case 'success':
                return {
                    ...baseStyle,
                    background: 'rgba(76, 175, 80, 0.2)',
                    borderColor: 'rgba(76, 175, 80, 0.5)'
                };
            case 'error':
                return {
                    ...baseStyle,
                    background: 'rgba(244, 67, 54, 0.2)',
                    borderColor: 'rgba(244, 67, 54, 0.5)'
                };
            case 'warning':
                return {
                    ...baseStyle,
                    background: 'rgba(255, 152, 0, 0.2)',
                    borderColor: 'rgba(255, 152, 0, 0.5)'
                };
            case 'info':
                return {
                    ...baseStyle,
                    background: 'rgba(33, 150, 243, 0.2)',
                    borderColor: 'rgba(33, 150, 243, 0.5)'
                };
            default:
                return {
                    ...baseStyle,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                };
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '📢';
        }
    };

    if (!isVisible && duration === 0) return null;

    return (
        <div style={getNotificationStyle()}>
            <span>{getIcon()}</span>
            <span>{message}</span>
            <button
                onClick={() => {
                    setIsVisible(false);
                    if (onClose) {
                        setTimeout(onClose, 300);
                    }
                }}
                style={{
                    background: 'none',
                    border: 'none',
                    marginLeft: 'auto',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: 'white',
                    opacity: 0.8,
                    padding: '0 6px',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease'
                }}
            >
                ×
            </button>
        </div>
    );
};

// Container component for managing multiple notifications
export const NotificationContainer = ({ notifications, removeNotification }) => {
    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            maxWidth: '400px',
            width: '100%'
        }}>
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    type={notification.type}
                    message={notification.message}
                    duration={notification.duration}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
};

export default Notification;