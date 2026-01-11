import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { 
    fetchTransactionById, 
    updateTransaction,
    Transaction 
} from '@/services/transactionService';
import { fetchTransactionCategories, TransactionCategory } from '@/services/transactionService';

export const TransactionEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [transaction, setTransaction] = useState<Transaction | null>(null);

    const [formData, setFormData] = useState({
        type: 'expense' as 'income' | 'expense',
        amount: '',
        category_id: '',
        description: '',
        transaction_date: '',
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                if (!id) {
                    setError('記録IDが指定されていません');
                    return;
                }

                const [transactionData, categoriesData] = await Promise.all([
                    fetchTransactionById(parseInt(id, 10)),
                    fetchTransactionCategories()
                ]);
                
                setTransaction(transactionData);
                setCategories(categoriesData);
                
                // フォームデータを設定
                setFormData({
                    type: transactionData.type,
                    amount: transactionData.amount,
                    category_id: transactionData.category_id?.toString() || '',
                    description: transactionData.description || '',
                    transaction_date: transactionData.transaction_date,
                });
            } catch (err: any) {
                console.error('データ取得エラー:', err);
                setError(err.response?.data?.error || 'データの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!id) {
            setError('記録IDが指定されていません');
            setIsSubmitting(false);
            return;
        }

        // バリデーション
        if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
            setError('有効な金額を入力してください');
            setIsSubmitting(false);
            return;
        }

        if (!formData.transaction_date) {
            setError('記録日を入力してください');
            setIsSubmitting(false);
            return;
        }

        try {
            await updateTransaction(parseInt(id, 10), {
                type: formData.type,
                amount: parseFloat(formData.amount),
                category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
                description: formData.description.trim() || null,
                transaction_date: formData.transaction_date,
            });
            
            // 成功したら家計簿一覧に戻る
            navigate('/admin/transaction');
        } catch (err: any) {
            console.error('記録更新エラー:', err);
            setError(err.response?.data?.error || '記録の更新に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/transaction');
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

    if (!transaction) {
        return (
            <div className="flex h-screen bg-slate-50">
                <AdminAside />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <AdminHeader />
                    <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
                                <p className="text-slate-500 text-lg font-medium">記録が見つかりません</p>
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
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS[`/admin/transaction/${id}/edit`] || []} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">記録編集</h2>
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
                            <h3 className="text-lg font-bold text-slate-900">記録情報</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* タイプ */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        タイプ <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="income"
                                                checked={formData.type === 'income'}
                                                onChange={(e) => setFormData({ ...formData, type: 'income' })}
                                                className="mr-2"
                                            />
                                            <span className="text-sm font-bold text-green-600">入金</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="expense"
                                                checked={formData.type === 'expense'}
                                                onChange={(e) => setFormData({ ...formData, type: 'expense' })}
                                                className="mr-2"
                                            />
                                            <span className="text-sm font-bold text-red-600">出金</span>
                                        </label>
                                    </div>
                                </div>

                                {/* 金額 */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        金額 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                {/* カテゴリ */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        カテゴリ
                                    </label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                    >
                                        <option value="">選択してください</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 記録日 */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        記録日 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.transaction_date}
                                        onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        required
                                    />
                                </div>

                                {/* 説明 */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        説明
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        placeholder="記録の説明を入力してください"
                                    />
                                </div>

                                {/* ボタン */}
                                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-bold"
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <i className="fas fa-spinner fa-spin"></i>
                                                更新中...
                                            </span>
                                        ) : (
                                            '更新'
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

