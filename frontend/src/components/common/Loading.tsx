import React from 'react';

interface LoadingProps {
    message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = '読み込み中...' }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                <p className="mt-4 text-slate-600">{message}</p>
            </div>
        </div>
    );
};

