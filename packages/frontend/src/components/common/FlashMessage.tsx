import React, { useEffect } from 'react';

interface FlashMessageProps {
    message: string | null;
    type?: 'success' | 'error' | 'info' | 'warning';
    onClose?: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

export const FlashMessage: React.FC<FlashMessageProps> = ({
    message,
    type = 'info',
    onClose,
    autoClose = true,
    autoCloseDelay = 5000,
}) => {
    useEffect(() => {
        if (message && autoClose && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [message, autoClose, autoCloseDelay, onClose]);

    if (!message) return null;

    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    container: 'bg-green-50 border border-green-200 text-green-700',
                    icon: 'fa-check-circle',
                };
            case 'error':
                return {
                    container: 'bg-red-50 border border-red-200 text-red-700',
                    icon: 'fa-exclamation-circle',
                };
            case 'warning':
                return {
                    container: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
                    icon: 'fa-exclamation-triangle',
                };
            case 'info':
            default:
                return {
                    container: 'bg-blue-50 border border-blue-200 text-blue-700',
                    icon: 'fa-info-circle',
                };
        }
    };

    const styles = getStyles();

    return (
        <div className={`${styles.container} px-4 py-3 rounded-lg flex items-center justify-between gap-3`}>
            <div className="flex items-center gap-2 flex-1">
                <i className={`fas ${styles.icon}`}></i>
                <p className="font-medium">{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="閉じる"
                >
                    <i className="fas fa-times"></i>
                </button>
            )}
        </div>
    );
};

