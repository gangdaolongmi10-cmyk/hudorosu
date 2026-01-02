import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { updateCategory, fetchCategories, deleteCategory } from '@/services/categoryService';
import { fetchFoodsByCategory } from '@/services/foodService';
import { Category } from '@/types/category';
import { Food } from '@/types/food';

export const CategoryEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [category, setCategory] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [foods, setFoods] = useState<Food[]>([]);
    const [foodsLoading, setFoodsLoading] = useState(false);
    const [foodsTotal, setFoodsTotal] = useState(0);
    const [foodsPage, setFoodsPage] = useState(1);
    const [foodsLimit] = useState(20);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        const loadCategory = async () => {
            if (!id) {
                setError('カテゴリーIDが指定されていません');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const categories = await fetchCategories();
                const foundCategory = categories.find(c => c.id === parseInt(id, 10));
                
                if (!foundCategory) {
                    setError('カテゴリーが見つかりません');
                    setIsLoading(false);
                    return;
                }

                setCategory(foundCategory);
                setFormData({
                    name: foundCategory.name || '',
                    description: foundCategory.description || '',
                });
            } catch (err: any) {
                console.error('カテゴリー取得エラー:', err);
                setError(err.response?.data?.error || 'カテゴリー情報の取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadCategory();
    }, [id]);

    useEffect(() => {
        const loadFoods = async () => {
            if (!id) return;

            try {
                setFoodsLoading(true);
                const offset = (foodsPage - 1) * foodsLimit;
                const data = await fetchFoodsByCategory(parseInt(id, 10), foodsLimit, offset);
                setFoods(data.foods);
                setFoodsTotal(data.total);
            } catch (err: any) {
                console.error('食材取得エラー:', err);
            } finally {
                setFoodsLoading(false);
            }
        };

        loadFoods();
    }, [id, foodsPage, foodsLimit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!id) {
            setError('カテゴリーIDが指定されていません');
            setIsSubmitting(false);
            return;
        }

        // バリデーション
        if (!formData.name || formData.name.trim() === '') {
            setError('カテゴリー名を入力してください');
            setIsSubmitting(false);
            return;
        }

        try {
            await updateCategory(parseInt(id, 10), {
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
            });
            
            // 成功したらカテゴリ一覧に戻る
            navigate('/admin/category');
        } catch (err: any) {
            console.error('カテゴリー更新エラー:', err);
            setError(err.response?.data?.error || 'カテゴリーの更新に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/category');
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!id) return;

        try {
            setIsDeleting(true);
            await deleteCategory(parseInt(id, 10));
            // 成功したらカテゴリ一覧に戻る
            navigate('/admin/category');
        } catch (err: any) {
            console.error('カテゴリー削除エラー:', err);
            setError(err.response?.data?.error || 'カテゴリーの削除に失敗しました');
            setDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const totalPages = Math.ceil(foodsTotal / foodsLimit);

    const handleFoodEdit = (foodId: number) => {
        navigate(`/admin/food/${foodId}/edit`);
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
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/category/:id/edit']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">カテゴリ編集</h2>
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
                            <h3 className="text-lg font-bold text-slate-900">カテゴリ情報</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        カテゴリー名 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="カテゴリー名を入力"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        説明
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="カテゴリーの説明を入力（任意）"
                                        rows={4}
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDeleting ? (
                                            <span className="flex items-center gap-2">
                                                <i className="fas fa-spinner fa-spin"></i>
                                                削除中...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <i className="fas fa-trash"></i>
                                                削除
                                            </span>
                                        )}
                                    </button>
                                    <div className="flex gap-3">
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
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* 紐づく食材一覧 */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">紐づく食材一覧</h3>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                全 {foodsTotal} 件
                            </span>
                        </div>
                        <div className="p-6">
                            {foodsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <i className="fas fa-spinner fa-spin text-2xl"></i>
                                        <span className="text-lg font-medium">読み込み中...</span>
                                    </div>
                                </div>
                            ) : foods.length === 0 ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <i className="fas fa-database text-6xl text-slate-300 mb-4"></i>
                                        <p className="text-slate-500 text-lg font-medium">このカテゴリーに紐づく食材がありません</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse text-sm">
                                            <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                                                <tr>
                                                    <th className="px-6 py-4 border-b border-slate-100">食材名</th>
                                                    <th className="px-6 py-4 border-b border-slate-100">特定アレルギー</th>
                                                    <th className="px-6 py-4 border-b border-slate-100">最終更新日</th>
                                                    <th className="px-6 py-4 border-b border-slate-100 text-center">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {foods.map((food) => (
                                                    <tr key={food.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 border-b border-slate-100">
                                                            <span className="font-bold text-slate-900">{food.name}</span>
                                                        </td>
                                                        <td className="px-6 py-4 border-b border-slate-100">
                                                            {food.allergens && food.allergens.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {food.allergens.map((allergen) => (
                                                                        <span
                                                                            key={allergen.id}
                                                                            className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-md"
                                                                        >
                                                                            {allergen.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 border-b border-slate-100">
                                                            <span className="text-slate-600">{formatDate(food.updated_at)}</span>
                                                        </td>
                                                        <td className="px-6 py-4 border-b border-slate-100 text-center">
                                                            <button
                                                                onClick={() => handleFoodEdit(food.id)}
                                                                className="text-sky-600 hover:text-sky-700 transition-colors"
                                                                title="編集"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* ページネーション */}
                                    {totalPages > 1 && (
                                        <div className="mt-6 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setFoodsPage(prev => Math.max(1, prev - 1))}
                                                disabled={foodsPage === 1}
                                                className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                            <div className="flex items-center gap-2">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                    // 現在のページ周辺のみ表示
                                                    if (
                                                        page === 1 ||
                                                        page === totalPages ||
                                                        (page >= foodsPage - 2 && page <= foodsPage + 2)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={page}
                                                                onClick={() => setFoodsPage(page)}
                                                                className={`px-4 py-2 text-sm rounded-lg transition-colors font-bold ${
                                                                    foodsPage === page
                                                                        ? 'bg-sky-600 text-white'
                                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                                }`}
                                                            >
                                                                {page}
                                                            </button>
                                                        );
                                                    } else if (
                                                        page === foodsPage - 3 ||
                                                        page === foodsPage + 3
                                                    ) {
                                                        return (
                                                            <span key={page} className="px-2 text-slate-400">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                            <button
                                                onClick={() => setFoodsPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={foodsPage === totalPages}
                                                className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* 削除確認モーダル */}
                    <ConfirmModal
                        isOpen={deleteModalOpen}
                        title="カテゴリーの削除"
                        message={`「${category?.name}」を削除してもよろしいですか？この操作は取り消せません。関連する食材がある場合は削除できません。`}
                        confirmText="削除"
                        cancelText="キャンセル"
                        onConfirm={handleDeleteConfirm}
                        onCancel={handleDeleteCancel}
                        variant="danger"
                    />
                </div>
            </main>
        </div>
    );
};

