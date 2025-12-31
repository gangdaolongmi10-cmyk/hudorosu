import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
            <h1 className="text-6xl font-bold text-slate-800">404</h1>
            <p className="text-xl text-slate-600 mt-4">お探しのページは見つかりませんでした。</p>
            <button className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => navigate('/admin')}>
                管理画面トップへ戻る
            </button>
        </div>
    );
};
