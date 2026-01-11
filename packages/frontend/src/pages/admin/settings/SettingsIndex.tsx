import React, { useEffect, useState } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { User } from '@/types/user';
import { getCurrentUser, updateUser, changePassword, getSystemSettings, updateSystemSettings, SystemSettings, uploadAvatar } from '@/services/settingsService';
import { ROLE, ROLE_BADGE_COLORS, ROLE_LABELS } from '@/constants/role';
import { useAuth } from '@/contexts/AuthContext';

export const SettingsIndexPage: React.FC = () => {
    const { user: authUser, updateUser: updateAuthUser } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // システム設定の状態
    const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
    const [systemSettingsLoading, setSystemSettingsLoading] = useState(false);
    const [systemSettingsForm, setSystemSettingsForm] = useState<Record<string, string>>({});
    const [isSystemSettingsSubmitting, setIsSystemSettingsSubmitting] = useState(false);

    // プロフィール設定のフォーム状態
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
    });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
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
                setAvatarPreview(data.avatar_url || null);
                setAvatarFile(null);
            } catch (err: any) {
                console.error('ユーザー取得エラー:', err);
                setError(err.response?.data?.error || 'ユーザー情報の取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
        
        // システム設定を読み込む（管理者のみ）
        if (authUser?.role === ROLE.ADMIN) {
            loadSystemSettings();
        }
    }, [authUser]);

    const loadSystemSettings = async () => {
        try {
            setSystemSettingsLoading(true);
            const settings = await getSystemSettings();
            setSystemSettings(settings);
            
            // フォーム用の初期値を設定
            const formData: Record<string, string> = {};
            Object.keys(settings).forEach(key => {
                formData[key] = settings[key].value || '';
            });
            setSystemSettingsForm(formData);
        } catch (err: any) {
            console.error('システム設定取得エラー:', err);
        } finally {
            setSystemSettingsLoading(false);
        }
    };

    const handleSystemSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSystemSettingsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            await updateSystemSettings(systemSettingsForm);
            setSuccess('システム設定が正常に更新されました');
            // 設定を再読み込み
            await loadSystemSettings();
        } catch (err: any) {
            console.error('システム設定更新エラー:', err);
            setError(err.response?.data?.error || 'システム設定の更新に失敗しました');
        } finally {
            setIsSystemSettingsSubmitting(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // ファイルサイズチェック（5MB以下）
            if (file.size > 5 * 1024 * 1024) {
                setError('画像ファイルのサイズは5MB以下である必要があります');
                return;
            }

            // ファイルタイプチェック
            if (!file.type.startsWith('image/')) {
                setError('画像ファイルを選択してください');
                return;
            }

            setAvatarFile(file);
            // プレビュー用にローカルで読み込む
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarRemove = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProfileSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            let avatarUrl: string | null | undefined = user?.avatar_url;

            // 新しい画像が選択されている場合
            if (avatarFile) {
                // ファイルをアップロードしてURLを取得
                avatarUrl = await uploadAvatar(avatarFile);
            } else if (avatarPreview === null && user?.avatar_url) {
                // 画像が削除された場合（既存の画像があったが、プレビューがnullになった）
                avatarUrl = null;
            } else if (avatarPreview && !avatarFile) {
                // 既存の画像をそのまま使用（変更なし）
                // avatarPreviewがURLの場合はそのまま、base64の場合は既存のURLを使用
                if (avatarPreview.startsWith('http://') || avatarPreview.startsWith('https://') || avatarPreview.startsWith('/api/')) {
                    avatarUrl = avatarPreview;
                } else {
                    // base64の場合は既存のURLを維持
                    avatarUrl = user?.avatar_url;
                }
            }

            const updatedUser = await updateUser({
                name: profileForm.name || undefined,
                email: profileForm.email || undefined,
                avatar_url: avatarUrl,
            });
            setUser(updatedUser);
            setAvatarPreview(updatedUser.avatar_url || null);
            setAvatarFile(null);
            setSuccess('プロフィールが正常に更新されました');
            
            // AuthContextのユーザー情報も更新
            updateAuthUser({
                name: updatedUser.name || undefined,
                email: updatedUser.email,
                avatar_url: updatedUser.avatar_url || undefined,
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
            setError('パスワードが一致しません');
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
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/settings']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">設定</h2>
                        </div>
                    </div>

                    {/* フラッシュメッセージ */}
                    <FlashMessage
                        message={error}
                        type="error"
                        onClose={() => setError(null)}
                    />
                    <FlashMessage
                        message={success}
                        type="success"
                        onClose={() => setSuccess(null)}
                    />

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
                                        {/* プロフィール画像 */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                プロフィール画像
                                            </label>
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    {avatarPreview ? (
                                                        <img
                                                            src={avatarPreview}
                                                            alt="プロフィール画像"
                                                            className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                                                        />
                                                    ) : (
                                                        <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                                                            <i className="fas fa-user text-slate-400 text-2xl"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleAvatarChange}
                                                            className="hidden"
                                                            disabled={isProfileSubmitting}
                                                        />
                                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-bold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                                            <i className="fas fa-camera"></i>
                                                            画像を選択
                                                        </span>
                                                    </label>
                                                    {avatarPreview && (
                                                        <button
                                                            type="button"
                                                            onClick={handleAvatarRemove}
                                                            disabled={isProfileSubmitting}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                            削除
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">
                                                対応形式: JPG, PNG, GIF（最大5MB）
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                名前（任意）
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
                                                    '更新する'
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
                                                確認パスワード
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="パスワード（再入力）"
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
                                                    '変更する'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* システム設定（管理者のみ） */}
                            {authUser?.role === ROLE.ADMIN && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                                        <h3 className="text-lg font-bold text-slate-900">システム設定</h3>
                                        <p className="text-sm text-slate-500 mt-1">アプリケーション全体の設定を管理します</p>
                                    </div>
                                    <div className="p-6">
                                        {systemSettingsLoading ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="flex items-center gap-3 text-slate-500">
                                                    <i className="fas fa-spinner fa-spin text-2xl"></i>
                                                    <span className="text-lg font-medium">読み込み中...</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSystemSettingsSubmit} className="space-y-6">
                                                {/* システム設定 */}
                                                <div>
                                                    <h4 className="text-md font-bold text-slate-900 mb-4">
                                                        <i className="fas fa-tools text-purple-600 mr-2"></i>
                                                        システム設定
                                                    </h4>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="flex items-center gap-3 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={systemSettingsForm.maintenance_mode === 'true'}
                                                                    onChange={(e) => setSystemSettingsForm({ 
                                                                        ...systemSettingsForm, 
                                                                        maintenance_mode: e.target.checked ? 'true' : 'false' 
                                                                    })}
                                                                    className="w-5 h-5 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                                                                />
                                                                <span className="text-sm font-bold text-slate-700">メンテナンスモード</span>
                                                            </label>
                                                            {systemSettings?.maintenance_mode?.description && (
                                                                <p className="text-xs text-slate-500 mt-1 ml-8">{systemSettings.maintenance_mode.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4 border-t border-slate-200">
                                                    <button
                                                        type="submit"
                                                        disabled={isSystemSettingsSubmitting}
                                                        className="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSystemSettingsSubmitting ? (
                                                            <span className="flex items-center gap-2">
                                                                <i className="fas fa-spinner fa-spin"></i>
                                                                更新中...
                                                            </span>
                                                        ) : (
                                                            '更新する'
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

