import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from '@/constants/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE } from '@/constants/role';

export const AdminNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const isHomeActive = location.pathname === '/admin' || location.pathname === '/admin/';
    const isAdmin = user?.role === ROLE.ADMIN;
    const navItems = isAdmin ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

    return (
        <nav className="flex-1 px-4 space-y-2 mt-4">
            {/* HOMEリンク（管理者のみ） */}
            {isAdmin && (
                <button
                    onClick={() => navigate('/admin')}
                    className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors
                        ${isHomeActive ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <i className="fas fa-home w-5"></i>
                    ダッシュボード
                </button>
            )}
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors
                            ${isActive
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                        `}
                    >
                        <i className={`${item.icon} w-5`}></i>
                        {item.label}
                    </button>
                );
            })}
        </nav>
    );
};
