import React, { useEffect, useState } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { fetchStocks, fetchUserStocks, Stock } from '@/services/stockService';
import { fetchUsers, User } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE } from '@/constants/role';

export const StockIndexPage: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === ROLE.ADMIN;
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
    const [selectedStorageType, setSelectedStorageType] = useState<'refrigerator' | 'freezer' | 'pantry' | ''>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // 管理者の場合はユーザー一覧を取得
                if (isAdmin) {
                    const usersData = await fetchUsers();
                    setUsers(usersData);
                }
                
                await loadStocks();
            } catch (err: any) {
                console.error('データ取得エラー:', err);
                setError(err.response?.data?.error || 'データの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        loadStocks();
    }, [selectedUserId, selectedStorageType]);

    const loadStocks = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const storageType = selectedStorageType === '' ? undefined : selectedStorageType;
            
            if (isAdmin) {
                // 管理者の場合は、選択されたユーザーの在庫を取得（未選択の場合は全ユーザー）
                const userId = selectedUserId === '' ? undefined : selectedUserId;
                const data = await fetchStocks(userId, storageType);
                setStocks(data.stocks);
            } else {
                // 一般ユーザーの場合は、自分の在庫のみ
                const data = await fetchUserStocks(storageType);
                setStocks(data.stocks);
            }
        } catch (err: any) {
            console.error('在庫取得エラー:', err);
            setError(err.response?.data?.error || '在庫の取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const getStorageTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            refrigerator: '冷蔵庫',
            freezer: '冷凍庫',
            pantry: '常温'
        };
        return labels[type] || type;
    };

    const getStorageTypeBadgeColor = (type: string) => {
        const colors: Record<string, string> = {
            refrigerator: 'bg-blue-100 text-blue-800 border-blue-200',
            freezer: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            pantry: 'bg-amber-100 text-amber-800 border-amber-200'
        };
        return colors[type] || 'bg-slate-100 text-slate-800 border-slate-200';
    };

    const isExpired = (expiryDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(expiryDate);
        expiry.setHours(0, 0, 0, 0);
        return expiry < today;
    };

    const isExpiringSoon = (expiryDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);
        const expiry = new Date(expiryDate);
        expiry.setHours(0, 0, 0, 0);
        return expiry >= today && expiry <= threeDaysLater;
    };

    const getExpiryStatusBadge = (expiryDate: string) => {
        if (isExpired(expiryDate)) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                    期限切れ
                </span>
            );
        }
        if (isExpiringSoon(expiryDate)) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                    期限間近
                </span>
            );
        }
        return null;
    };

    // 検索フィルタリング
    const filteredStocks = stocks.filter(stock => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            stock.food?.name?.toLowerCase().includes(term) ||
            stock.user?.name?.toLowerCase().includes(term) ||
            stock.user?.email?.toLowerCase().includes(term) ||
            stock.memo?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminAside />
            <main className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* ヘッダーセクション */}
                    <div className="flex items-center justify-between">
                        <div>
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/stock']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">在庫管理</h2>
                        </div>
                    </div>

                    {/* フラッシュメッセージ */}
                    <FlashMessage
                        message={error}
                        type="error"
                        onClose={() => setError(null)}
                    />

                    {/* フィルターセクション */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                            {/* ユーザーフィルター（管理者のみ） */}
                            {isAdmin && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        ユーザー
                                    </label>
                                    <select
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                                    >
                                        <option value="">すべてのユーザー</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name || user.email} (ID: {user.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* 保存タイプフィルター */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    保存タイプ
                                </label>
                                <select
                                    value={selectedStorageType}
                                    onChange={(e) => setSelectedStorageType(e.target.value as any)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                                >
                                    <option value="">すべて</option>
                                    <option value="refrigerator">冷蔵庫</option>
                                    <option value="freezer">冷凍庫</option>
                                    <option value="pantry">常温</option>
                                </select>
                            </div>

                            {/* 検索 */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    検索
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={isAdmin ? "食材名、ユーザー名、メモで検索..." : "食材名、メモで検索..."}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ローディング状態 */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3 text-slate-500">
                                <i className="fas fa-spinner fa-spin text-2xl"></i>
                                <span className="text-lg font-medium">読み込み中...</span>
                            </div>
                        </div>
                    ) : filteredStocks.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <i className="fas fa-box-open text-6xl text-slate-300 mb-4"></i>
                                <p className="text-slate-500 text-lg font-medium">在庫がありません</p>
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
                                            {isAdmin && (
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                    ユーザー
                                                </th>
                                            )}
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                食材
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                期限日
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                保存タイプ
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                数量
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                メモ
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {filteredStocks.map((stock) => (
                                            <tr key={stock.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                    {stock.id}
                                                </td>
                                                {isAdmin && (
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm">
                                                            <div className="font-bold text-slate-900">
                                                                {stock.user?.name || '名前未設定'}
                                                            </div>
                                                            <div className="text-slate-500 text-xs">
                                                                {stock.user?.email}
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm">
                                                        <div className="font-bold text-slate-900">
                                                            {stock.food?.name || '不明'}
                                                        </div>
                                                        {stock.food?.category && (
                                                            <div className="text-slate-500 text-xs">
                                                                {stock.food.category.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm ${isExpired(stock.expiry_date) ? 'text-red-600 font-bold' : isExpiringSoon(stock.expiry_date) ? 'text-yellow-600 font-bold' : 'text-slate-900'}`}>
                                                            {formatDate(stock.expiry_date)}
                                                        </span>
                                                        {getExpiryStatusBadge(stock.expiry_date)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStorageTypeBadgeColor(stock.storage_type)}`}>
                                                        {getStorageTypeLabel(stock.storage_type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {stock.quantity || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                                                    {stock.memo || '-'}
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

