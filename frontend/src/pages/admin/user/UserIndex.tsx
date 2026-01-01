import React, { useEffect, useState } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { User } from '@/types/user';
import { fetchUsers } from '@/services/userService';
import { ROLE, ROLE_BADGE_COLORS, ROLE_LABELS } from '@/constants/role';

export const UserIndexPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchUsers();
                setUsers(data);
            } catch (err: any) {
                console.error('ユーザー取得エラー:', err);
                setError(err.response?.data?.error || 'ユーザーの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                                <span className="text-slate-900 font-bold">ユーザー管理</span>
                            </nav>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">ユーザー一覧</h2>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-2.5 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 font-bold">
                                <i className="fas fa-plus text-xs"></i> 新規ユーザーを追加
                            </button>
                        </div>
                    </div>

                    {/* エラーメッセージ */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <p className="font-medium">{error}</p>
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
                    ) : users.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <i className="fas fa-users text-6xl text-slate-300 mb-4"></i>
                                <p className="text-slate-500 text-lg font-medium">ユーザーがありません</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                ユーザー
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                メールアドレス
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                ロール
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                登録日時
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                更新日時
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                操作
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                    {user.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        {user.avatar_url ? (
                                                            <img
                                                                src={user.avatar_url}
                                                                alt={user.name || user.email}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                                                                <i className="fas fa-user text-sky-600"></i>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">
                                                                {user.name || '名前未設定'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRoleBadgeColor(user.role)}`}>
                                                        {getRoleLabel(user.role)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {formatDate(user.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {formatDate(user.updated_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-sky-600 hover:text-sky-800 mr-4">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-800">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

