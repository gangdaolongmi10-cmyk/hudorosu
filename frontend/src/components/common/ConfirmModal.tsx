import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'default';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = '確認',
    cancelText = 'キャンセル',
    onConfirm,
    onCancel,
    variant = 'default',
}) => {
    if (!isOpen) return null;

    const confirmButtonClass = variant === 'danger'
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-sky-600 hover:bg-sky-700 text-white';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-600 mb-6">{message}</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-bold"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 text-sm rounded-lg transition-colors font-bold ${confirmButtonClass}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

