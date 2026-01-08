import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { 
    fetchTransactions, 
    deleteTransaction, 
    Transaction,
    TransactionFilters 
} from '@/services/transactionService';
import { 
    fetchTransactionCategories, 
    TransactionCategory 
} from '@/services/transactionService';
import { fetchTransactionStats } from '@/services/transactionService';

export const TransactionIndexPage: React.FC = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [stats, setStats] = useState<{ totalIncome: number; totalExpense: number; balance: number } | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadTransactions();
        loadStats();
    }, [filterType, selectedCategoryId, startDate, endDate]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [categoriesData] = await Promise.all([
                fetchTransactionCategories()
            ]);
            setCategories(categoriesData);
            await loadTransactions();
            await loadStats();
        } catch (err: any) {
            console.error('データ取得エラー:', err);
            setError(err.response?.data?.error || 'データの取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const loadTransactions = async () => {
        try {
            const filters: TransactionFilters = {
                type: filterType === 'all' ? undefined : filterType,
                category_id: selectedCategoryId === '' ? undefined : selectedCategoryId as number,
                start_date: startDate || undefined,
                end_date: endDate || undefined
            };
            const data = await fetchTransactions(filters);
            setTransactions(data);
        } catch (err: any) {
            console.error('記録取得エラー:', err);
            setError(err.response?.data?.error || '記録の取得に失敗しました');
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await fetchTransactionStats(
                startDate || undefined,
                endDate || undefined
            );
            setStats(statsData);
        } catch (err: any) {
            console.error('統計情報取得エラー:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('この記録を削除してもよろしいですか？')) {
            return;
        }

        try {
            await deleteTransaction(id);
            setSuccessMessage('記録を削除しました');
            await loadTransactions();
            await loadStats();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            console.error('削除エラー:', err);
            setError(err.response?.data?.error || '削除に失敗しました');
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

    const formatCurrency = (amount: string | number) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY'
        }).format(num);
    };

    const getTypeLabel = (type: string) => {
        return type === 'income' ? '入金' : '出金';
    };

    const getTypeBadgeColor = (type: string) => {
        return type === 'income' 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-red-100 text-red-800 border-red-200';
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
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/transaction'] || []} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">家計簿</h2>
                        </div>
                        <button
                            onClick={() => navigate('/admin/transaction/create')}
                            className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-bold shadow-sm"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            新規登録
                        </button>
                    </div>

                    {/* フラッシュメッセージ */}
                    <FlashMessage
                        message={error}
                        type="error"
                        onClose={() => setError(null)}
                    />
                    <FlashMessage
                        message={successMessage}
                        type="success"
                        onClose={() => setSuccessMessage(null)}
                    />

                    {/* 統計情報 */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <div className="text-sm font-bold text-slate-600 mb-2">総入金</div>
                                <div className="text-2xl font-extrabold text-green-600">
                                    {formatCurrency(stats.totalIncome)}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <div className="text-sm font-bold text-slate-600 mb-2">総出金</div>
                                <div className="text-2xl font-extrabold text-red-600">
                                    {formatCurrency(stats.totalExpense)}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <div className="text-sm font-bold text-slate-600 mb-2">残高</div>
                                <div className={`text-2xl font-extrabold ${stats.balance >= 0 ? 'text-sky-600' : 'text-red-600'}`}>
                                    {formatCurrency(stats.balance)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* フィルターセクション */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* タイプフィルター */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    タイプ
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilterType('all')}
                                        className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                            filterType === 'all'
                                                ? 'bg-sky-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        すべて
                                    </button>
                                    <button
                                        onClick={() => setFilterType('income')}
                                        className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                            filterType === 'income'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        入金
                                    </button>
                                    <button
                                        onClick={() => setFilterType('expense')}
                                        className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                            filterType === 'expense'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        出金
                                    </button>
                                </div>
                            </div>

                            {/* カテゴリフィルター */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    カテゴリ
                                </label>
                                <select
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                                >
                                    <option value="">すべて</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 開始日 */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    開始日
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                                />
                            </div>

                            {/* 終了日 */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    終了日
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
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
                    ) : transactions.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <i className="fas fa-wallet text-6xl text-slate-300 mb-4"></i>
                                <p className="text-slate-500 text-lg font-medium">記録がありません</p>
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
                                                日付
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                タイプ
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                金額
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                カテゴリ
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                説明
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                操作
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                    {transaction.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                                    {formatDate(transaction.transaction_date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTypeBadgeColor(transaction.type)}`}>
                                                        {getTypeLabel(transaction.type)}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                                                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {transaction.type === 'income' ? '+' : '-'}
                                                    {formatCurrency(transaction.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {transaction.category ? (
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: transaction.category.color }}
                                                            ></div>
                                                            <span className="text-sm text-slate-900">
                                                                {transaction.category.name}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-400">未分類</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                                                    {transaction.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/transaction/${transaction.id}/edit`)}
                                                            className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors font-bold"
                                                        >
                                                            <i className="fas fa-edit mr-1"></i>
                                                            編集
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(transaction.id)}
                                                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-bold"
                                                        >
                                                            <i className="fas fa-trash mr-1"></i>
                                                            削除
                                                        </button>
                                                    </div>
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

