import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE } from '../../constants/role';

interface UserProtectedRouteProps {
    children: React.ReactElement;
}

/**
 * 一般ユーザー（管理者以外）のみアクセス可能なルート
 */
export const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                    <p className="mt-4 text-slate-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // 管理者はアクセス不可
    if (user?.role === ROLE.ADMIN) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <i className="fas fa-ban text-6xl text-red-500 mb-4"></i>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">アクセス権限がありません</h2>
                    <p className="text-slate-600 mb-4">この画面は一般ユーザーのみがアクセスできます。</p>
                    <button onClick={handleLogout} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-bold">
                        ログイン画面に戻る
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

