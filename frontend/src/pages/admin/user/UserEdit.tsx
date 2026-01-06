import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { updateUser, fetchUsers, uploadAvatar } from '@/services/userService';
import { ROLE, ROLE_LABELS } from '@/constants/role';
import { User } from '@/types/user';
import { DEFAULT_USER_AVATAR_URL } from '@/constants/user';

export const UserEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<{
        email: string;
        password: string;
        confirmPassword: string;
        name: string;
        role: string;
    }>({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        role: ROLE.USER,
    });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            if (!id) {
                setError('ユーザーIDが指定されていません');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const users = await fetchUsers();
                const foundUser = users.find(u => u.id === parseInt(id, 10));
                
                if (!foundUser) {
                    setError('ユーザーが見つかりません');
                    setIsLoading(false);
                    return;
                }

                setUser(foundUser);
                setFormData({
                    email: foundUser.email || '',
                    password: '',
                    confirmPassword: '',
                    name: foundUser.name || '',
                    role: foundUser.role || ROLE.USER,
                });
                setAvatarPreview(foundUser.avatar_url || null);
                setAvatarFile(null);
            } catch (err: any) {
                console.error('ユーザー取得エラー:', err);
                setError(err.response?.data?.error || 'ユーザー情報の取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!id) {
            setError('ユーザーIDが指定されていません');
            setIsSubmitting(false);
            return;
        }

        // バリデーション
        if (!formData.email) {
            setError('メールアドレスを入力してください');
            setIsSubmitting(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('有効なメールアドレスを入力してください');
            setIsSubmitting(false);
            return;
        }

        // パスワードが入力されている場合のみバリデーション
        if (formData.password) {
            if (formData.password !== formData.confirmPassword) {
                setError('パスワードが一致しません');
                setIsSubmitting(false);
                return;
            }

            if (formData.password.length < 6) {
                setError('パスワードは6文字以上である必要があります');
                setIsSubmitting(false);
                return;
            }
        }

        try {
            let avatarUrl: string | null | undefined = user?.avatar_url;

            // 新しい画像が選択されている場合
            if (avatarFile) {
                // ファイルをアップロードしてURLを取得（フルURLが返される）
                const fullUrl = await uploadAvatar(avatarFile);
                // バックエンドに送信する際は相対パスに変換
                // フルURLから相対パスを抽出（例: 'http://localhost:3000/api/uploads/file.jpg' -> '/api/uploads/file.jpg'）
                if (fullUrl.startsWith('http://') || fullUrl.startsWith('https://')) {
                    const url = new URL(fullUrl);
                    avatarUrl = url.pathname;
                } else {
                    avatarUrl = fullUrl;
                }
            } else if (avatarPreview === null && user?.avatar_url) {
                // 画像が削除された場合（既存の画像があったが、プレビューがnullになった）
                avatarUrl = null;
            } else if (avatarPreview && !avatarFile) {
                // 既存の画像をそのまま使用（変更なし）
                // avatarPreviewがフルURLの場合は相対パスに変換、base64の場合は既存のURLを使用
                if (avatarPreview.startsWith('http://') || avatarPreview.startsWith('https://')) {
                    const url = new URL(avatarPreview);
                    avatarUrl = url.pathname;
                } else if (avatarPreview.startsWith('/api/')) {
                    // 既に相対パスの場合はそのまま
                    avatarUrl = avatarPreview;
                } else if (avatarPreview.startsWith('data:')) {
                    // base64の場合は既存のURLを維持（相対パスに変換）
                    if (user?.avatar_url) {
                        if (user.avatar_url.startsWith('http://') || user.avatar_url.startsWith('https://')) {
                            const url = new URL(user.avatar_url);
                            avatarUrl = url.pathname;
                        } else {
                            avatarUrl = user.avatar_url;
                        }
                    } else {
                        avatarUrl = null;
                    }
                } else {
                    // その他の場合は既存のURLを維持（相対パスに変換）
                    if (user?.avatar_url) {
                        if (user.avatar_url.startsWith('http://') || user.avatar_url.startsWith('https://')) {
                            const url = new URL(user.avatar_url);
                            avatarUrl = url.pathname;
                        } else {
                            avatarUrl = user.avatar_url;
                        }
                    } else {
                        avatarUrl = null;
                    }
                }
            }

            const updateData: {
                email?: string;
                name?: string;
                role?: string;
                password?: string;
                avatar_url?: string | null;
            } = {
                email: formData.email,
                name: formData.name || undefined,
                role: formData.role || undefined,
                avatar_url: avatarUrl,
            };

            // パスワードが入力されている場合のみ更新
            if (formData.password) {
                updateData.password = formData.password;
            }

            await updateUser(parseInt(id, 10), updateData);
            
            // 成功したらユーザー一覧に戻る
            navigate('/admin/user');
        } catch (err: any) {
            console.error('ユーザー更新エラー:', err);
            setError(err.response?.data?.error || 'ユーザーの更新に失敗しました');
        } finally {
            setIsSubmitting(false);
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

    const handleCancel = () => {
        navigate('/admin/user');
    };

    if (isLoading) {
        return (
            <div className="flex h-screen bg-slate-50">
                <AdminAside />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <AdminHeader />
                    <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3 text-slate-500">
                                <i className="fas fa-spinner fa-spin text-2xl"></i>
                                <span className="text-lg font-medium">読み込み中...</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminAside />
            <main className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* ヘッダーセクション */}
                    <div className="flex items-center justify-between">
                        <div>
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/user/:id/edit']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">ユーザー編集</h2>
                        </div>
                    </div>

                    {/* フラッシュメッセージ */}
                    <FlashMessage
                        message={error}
                        type="error"
                        onClose={() => setError(null)}
                    />

                    {/* フォーム */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-900">ユーザー情報</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                                <img
                                                    src={DEFAULT_USER_AVATAR_URL}
                                                    alt="デフォルト画像"
                                                    className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                    disabled={isSubmitting}
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
                                                    disabled={isSubmitting}
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
                                        メールアドレス <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="example@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        名前（任意）
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="山田 太郎"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        パスワード（変更する場合のみ入力）
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="パスワードを入力（変更する場合のみ、6文字以上）"
                                        minLength={6}
                                    />
                                    <p className="mt-1 text-xs text-slate-500">変更しない場合は空欄のままにしてください</p>
                                </div>

                                {formData.password && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            確認パスワード
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            placeholder="パスワード（再入力）"
                                            minLength={6}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        ロール <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        required
                                    >
                                        <option value={ROLE.USER}>{ROLE_LABELS[ROLE.USER]}</option>
                                        <option value={ROLE.ADMIN}>{ROLE_LABELS[ROLE.ADMIN]}</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-bold"
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
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
                </div>
            </main>
        </div>
    );
};

