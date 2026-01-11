import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNav } from "./AdminNav"
import { useAuth } from '@/contexts/AuthContext';
import { getAppName } from '@/services/settingsService';
import { ROLE } from '@/constants/role';

export const AdminAside: React.FC = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [appName, setAppName] = useState<string>('FoodDB');

    useEffect(() => {
        const loadAppName = async () => {
            try {
                const name = await getAppName();
                setAppName(name);
            } catch (error) {
                console.error('アプリ名取得エラー:', error);
            }
        };

        loadAppName();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleLogoClick = () => {
        if (user?.role === ROLE.ADMIN) {
            navigate('/admin');
        } else {
            navigate('/admin/stock');
        }
    };

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 h-screen overflow-hidden">
            {/* ヘッダー部分（固定） */}
            <div className="p-6 shrink-0">
                <h1 
                    onClick={handleLogoClick}
                    className="text-2xl font-bold tracking-wider flex items-center gap-2 text-sky-400 cursor-pointer hover:text-sky-300 transition-colors"
                >
                    <i className="fas fa-box-open"></i> {appName}
                </h1>
            </div>
            {/* ナビゲーションメニュー（スクロール可能） */}
            <div className="flex-1 overflow-y-auto sidebar-scrollbar">
                <AdminNav />
            </div>
            {/* ログアウトボタン（固定） */}
            <div className="p-4 border-t border-slate-800 shrink-0">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors w-full text-left text-sm"
                >
                    <i className="fas fa-sign-out-alt w-5"></i>
                    ログアウト
                </button>
            </div>
        </aside>
    )
}
