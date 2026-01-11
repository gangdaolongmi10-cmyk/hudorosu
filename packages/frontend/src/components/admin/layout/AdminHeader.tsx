import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_USER_AVATAR_URL } from "@/constants/user";

export const AdminHeader: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 shrink-0">
            <div className="flex items-center gap-4 text-slate-500">
                <button
                    onClick={() => navigate("/admin/settings")}
                    className="flex items-center gap-2 border-l pl-4 ml-2 text-slate-700 hover:text-sky-600 transition-colors"
                >
                    <img
                        src={user?.avatar_url || DEFAULT_USER_AVATAR_URL}
                        alt={user?.name || user?.email || "ユーザー"}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium">{user?.name || user?.email || "ユーザー"}</span>
                </button>
            </div>
        </header>
    );
};