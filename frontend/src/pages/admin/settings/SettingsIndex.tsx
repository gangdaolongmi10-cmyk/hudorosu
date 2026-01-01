import React, { useEffect, useState } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { User } from '@/types/user';
import { getCurrentUser, updateUser, changePassword } from '@/services/settingsService';
import { ROLE, ROLE_BADGE_COLORS, ROLE_LABELS } from '@/constants/role';
import { useAuth } from '@/contexts/AuthContext';

export const SettingsIndexPage: React.FC = () => {
    const { user: authUser, updateUser: updateAuthUser } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // プロフィール設定のフォーム状態
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
    });
    const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

    // パスワード変更のフォーム状態
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getCurrentUser();
                setUser(data);
                setProfileForm({
                    name: data.name || '',
                    email: data.email || '',
                });
            } catch (err: any) {
                console.error('ユーザー取得エラー:', err);
                setError(err.response?.data?.error || 'ユーザー情報の取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProfileSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const updatedUser = await updateUser({
                name: profileForm.name || undefined,
                email: profileForm.email || undefined,
            });
            setUser(updatedUser);
            setSuccess('プロフィールが正常に更新されました');
            
            // AuthContextのユーザー情報も更新
            updateAuthUser({
                name: updatedUser.name || undefined,
                email: updatedUser.email,
            });
        } catch (err: any) {
            console.error('プロフィール更新エラー:', err);
            setError(err.response?.data?.error || 'プロフィールの更新に失敗しました');
        } finally {
            setIsProfileSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordSubmitting(true);
        setError(null);
        setSuccess(null);

        // バリデーション
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('新しいパスワードと確認パスワードが一致しません');
            setIsPasswordSubmitting(false);
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setError('新しいパスワードは6文字以上である必要があります');
            setIsPasswordSubmitting(false);
            return;
        }

        try {
            await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            setSuccess('パスワードが正常に変更されました');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err: any) {
            console.error('パスワード変更エラー:', err);
            setError(err.response?.data?.error || 'パスワードの変更に失敗しました');
        } finally {
            setIsPasswordSubmitting(false);
        }
    };

    const getRoleBadgeColor = (role: string | null) => {
        if (role === ROLE.ADMIN) {
            return ROLE_BADGE_COLORS[ROLE.ADMIN];
        }
        if (role === ROLE.USER) {
            return ROLE_BADGE_COLORS[ROLE.USER];
        }
        return 'bg-slate-100 text-slate-800 border-slate-200';
    };

    const getRoleLabel = (role: string | null) => {
        if (role === ROLE.ADMIN) {
            return ROLE_LABELS[ROLE.ADMIN];
        }
        if (role === ROLE.USER) {
            return ROLE_LABELS[ROLE.USER];
        }
        return '未設定';
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminAside />
            <main className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* ヘッダーセクション */}
                    <div className="flex items-center justify-between">
                        <div>
                            <nav className="flex items-center text-sm text-slate-500 gap-2 mb-2 font-medium tracking-wide">
                                <span className="hover:text-sky-600 cursor-pointer">HOME</span>
                                <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
                                <span className="text-slate-900 font-bold">設定</span>
                            </nav>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">設定</h2>
                        </div>
                    </div>

                    {/* エラーメッセージ */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {/* 成功メッセージ */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            <p className="font-medium">{success}</p>
                        </div>
                    )}

                    {/* ローディング状態 */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3 text-slate-500">
                                <i className="fas fa-spinner fa-spin text-2xl"></i>
                                <span className="text-lg font-medium">読み込み中...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* プロフィール設定 */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                                    <h3 className="text-lg font-bold text-slate-900">プロフィール設定</h3>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                名前
                                            </label>
                                            <input
                                                type="text"
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="名前を入力"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                メールアドレス
                                            </label>
                                            <input
                                                type="email"
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="メールアドレスを入力"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                ロール
                                            </label>
                                            <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRoleBadgeColor(user?.role || null)}`}>
                                                    {getRoleLabel(user?.role || null)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={isProfileSubmitting}
                                                className="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isProfileSubmitting ? (
                                                    <span className="flex items-center gap-2">
                                                        <i className="fas fa-spinner fa-spin"></i>
                                                        更新中...
                                                    </span>
                                                ) : (
                                                    'プロフィールを更新'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* パスワード変更 */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                                    <h3 className="text-lg font-bold text-slate-900">パスワード変更</h3>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                現在のパスワード
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="現在のパスワードを入力"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                新しいパスワード
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="新しいパスワードを入力（6文字以上）"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                新しいパスワード（確認）
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="新しいパスワードを再度入力"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={isPasswordSubmitting}
                                                className="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isPasswordSubmitting ? (
                                                    <span className="flex items-center gap-2">
                                                        <i className="fas fa-spinner fa-spin"></i>
                                                        変更中...
                                                    </span>
                                                ) : (
                                                    'パスワードを変更'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

