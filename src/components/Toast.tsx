import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  duration?: number; // milliseconds; if undefined, stays until manual close
}

const Toast: React.FC<ToastProps> = ({
  message,
  actionLabel,
  onAction,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-navy text-white px-4 py-3 rounded shadow-lg z-50 flex items-center space-x-3">
      <span className="text-sm">{message}</span>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-gold text-navy font-medium px-3 py-1 rounded hover:bg-opacity-90 text-sm"
        >
          {actionLabel}
        </button>
      )}
      <button
        onClick={onClose}
        className="text-white hover:text-gray-300 text-lg leading-none ml-2"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast; 