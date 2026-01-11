import React, { useEffect, useState } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Category } from '@/types/category';
import { fetchCategories, deleteCategory } from '@/services/categoryService';
import { useNavigate } from 'react-router-dom';

export const CategoryIndexPage: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchCategories();
                setCategories(data);
            } catch (err: any) {
                console.error('カテゴリー取得エラー:', err);
                setError(err.response?.data?.error || 'カテゴリーの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

    const handleDeleteClick = (e: React.MouseEvent, category: Category) => {
        e.stopPropagation();
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;

        try {
            await deleteCategory(categoryToDelete.id);
            // 一覧を再読み込み
            const data = await fetchCategories();
            setCategories(data);
            setDeleteModalOpen(false);
            setCategoryToDelete(null);
        } catch (err: any) {
            console.error('カテゴリー削除エラー:', err);
            setError(err.response?.data?.error || 'カテゴリーの削除に失敗しました');
            setDeleteModalOpen(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
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
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/category']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">カテゴリ一覧</h2>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => navigate('/admin/category/create')}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 font-bold"
                            >
                                <i className="fas fa-plus text-xs"></i> 新規カテゴリを追加
                            </button>
                        </div>
                    </div>

                    {/* フラッシュメッセージ */}
                    <FlashMessage message={error} type="error" onClose={() => setError(null)}/>

                    {/* ローディング状態 */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3 text-slate-500">
                                <i className="fas fa-spinner fa-spin text-2xl"></i>
                                <span className="text-lg font-medium">読み込み中...</span>
                            </div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <i className="fas fa-folder-open text-6xl text-slate-300 mb-4"></i>
                                <p className="text-slate-500 text-lg font-medium">カテゴリーがありません</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/50">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {categories.length} 件
                                </span>
                            </div>
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-slate-100">カテゴリ名</th>
                                        <th className="px-6 py-4 border-b border-slate-100">説明</th>
                                        <th className="px-6 py-4 border-b border-slate-100">食材数</th>
                                        <th className="px-6 py-4 border-b border-slate-100 text-center">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category) => (
                                        <tr 
                                            key={category.id} 
                                            onClick={() => navigate(`/admin/category/${category.id}/edit`)}
                                            className="hover:bg-slate-50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4 border-b border-slate-100">
                                                <span className="font-bold text-slate-900">{category.name}</span>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-100">
                                                <span className="text-slate-700">{category.description || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-100">
                                                <span className="text-slate-700">{category.foodCount || 0} 件</span>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-100 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/admin/category/${category.id}/edit`);
                                                        }}
                                                        className="text-sky-600 hover:text-sky-700 transition-colors"
                                                        title="編集"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(e, category);
                                                        }}
                                                        className="text-red-600 hover:text-red-700 transition-colors"
                                                        title="削除"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 削除確認モーダル */}
                    <ConfirmModal
                        isOpen={deleteModalOpen}
                        title="カテゴリーの削除"
                        message={`「${categoryToDelete?.name}」を削除してもよろしいですか？この操作は取り消せません。関連する食材がある場合は削除できません。`}
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