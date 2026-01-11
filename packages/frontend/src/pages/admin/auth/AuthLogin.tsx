import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const AuthLoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    // 既にログインしている場合は管理画面にリダイレクト
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate("/admin", { replace: true });
        }
    }, [isAuthenticated, authLoading, navigate]);

    // 認証状態の読み込み中は何も表示しない
    if (authLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                    <p className="mt-4 text-slate-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(email, password);
            navigate("/admin");
        } catch (err: any) {
            setError(err.message || "ログインに失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="login-screen" className="fixed inset-0 z-[100] bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center p-8 overflow-y-auto">
            <div className="w-full max-w-md glass-card rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden fade-in">
                <div className="p-10 text-center">
                    <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-xl shadow-sky-200">
                        <i className="fas fa-box-open"></i>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">ふどろす</h1>
                    <p className="text-slate-400 text-sm mt-2 font-medium">食材マスタ管理システムへログイン</p>
                </div>
                <div className="px-10 pb-12 space-y-6">
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-5">
                            {/* メールアドレス */}
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                                    メールアドレス
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-4 text-slate-400">
                                        <i className="fas fa-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-sky-400 focus:bg-white transition-all font-medium text-slate-700"
                                    />
                                </div>
                            </div>

                            {/* パスワード */}
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                                    パスワード
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-4 text-slate-400">
                                        <i className="fas fa-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-sky-400 focus:bg-white transition-all font-medium text-slate-700"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-6 w-full py-4 bg-sky-500 text-white rounded-2xl font-bold hover:bg-sky-600 active:scale-[0.98] transition-all shadow-lg shadow-sky-100 flex items-center justify-center gap-2 text-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-circle-notch animate-spin"></i>
                                    <span>ログイン</span>
                                </>
                            ) : (
                                "ログイン"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};