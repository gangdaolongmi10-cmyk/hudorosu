import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const AdminHeader: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 shrink-0">
            <div className="flex items-center gap-4 text-slate-500">
                <button
                    onClick={() => navigate("/admin/settings")}
                    className="flex items-center gap-2 border-l pl-4 ml-2 text-slate-700 hover:text-sky-600 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
                        {userInitial}
                    </div>
                    <span className="text-sm font-medium">{user?.name || user?.email || "ユーザー"}</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                >
                    ログアウト
                </button>
            </div>
        </header>
    );
};