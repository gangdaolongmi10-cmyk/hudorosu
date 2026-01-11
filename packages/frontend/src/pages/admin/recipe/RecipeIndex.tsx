import React, { useEffect, useState } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { Recipe, fetchRecipes, deleteRecipe } from '@/services/recipeService';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export const RecipeIndexPage: React.FC = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const recipesData = await fetchRecipes();
                setRecipes(recipesData);
                setFilteredRecipes(recipesData);
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
        let filtered = [...recipes];

        // 料理名で検索
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(recipe => 
                recipe.name.toLowerCase().includes(query)
            );
        }

        setFilteredRecipes(filtered);
    }, [searchQuery, recipes]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const handleEdit = (id: number) => {
        navigate(`/admin/recipe/${id}/edit`);
    };

    const handleDeleteClick = (recipe: Recipe) => {
        setRecipeToDelete(recipe);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!recipeToDelete) return;

        try {
            await deleteRecipe(recipeToDelete.id);
            // 一覧を再読み込み
            const recipesData = await fetchRecipes();
            setRecipes(recipesData);
            setFilteredRecipes(recipesData);
            setDeleteModalOpen(false);
            setRecipeToDelete(null);
        } catch (err: any) {
            console.error('料理削除エラー:', err);
            setError(err.response?.data?.error || '料理の削除に失敗しました');
            setDeleteModalOpen(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setRecipeToDelete(null);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
    };

    const hasActiveFilters = searchQuery.trim() !== '';

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminAside />
            <main className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="flex items-center justify-between">
                        <div>
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/recipe']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">料理一覧</h2>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => navigate('/admin/recipe/create')}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 font-bold">
                                <i className="fas fa-plus text-xs"></i> 新規料理を登録
                            </button>
                        </div>
                    </div>

                    {/* エラーメッセージ */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* 検索セクション */}
                        <div className="p-5 border-b border-slate-100 bg-white/50">
                            <div className="flex gap-4 items-center">
                                <div className="flex-1 relative">
                                    <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="料理名で検索..."
                                        className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-4 py-2.5 text-sm bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-bold flex items-center gap-2"
                                    >
                                        <i className="fas fa-times"></i>
                                        フィルタをクリア
                                    </button>
                                )}
                                <div className="ml-auto">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        全 {recipes.length} 件中 {filteredRecipes.length} 件
                                    </span>
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
                        ) : filteredRecipes.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <i className="fas fa-utensils text-6xl text-slate-300 mb-4"></i>
                                    <p className="text-slate-500 text-lg font-medium">料理がありません</p>
                                </div>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-slate-100">料理名</th>
                                        <th className="px-6 py-4 border-b border-slate-100">使用食材</th>
                                        <th className="px-6 py-4 border-b border-slate-100">アレルギー</th>
                                        <th className="px-6 py-4 border-b border-slate-100">調理時間</th>
                                        <th className="px-6 py-4 border-b border-slate-100">人数</th>
                                        <th className="px-6 py-4 border-b border-slate-100">最終更新日</th>
                                        <th className="px-6 py-4 border-b border-slate-100 text-center">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecipes.map((recipe) => {
                                        const allergens = recipe.allergens || [];
                                        const foods = recipe.food_id_foods || [];
                                        
                                        return (
                                            <tr key={recipe.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 border-b border-slate-100">
                                                    <span className="font-bold text-slate-900">{recipe.name}</span>
                                                </td>
                                                <td className="px-6 py-4 border-b border-slate-100">
                                                    {foods.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {foods.slice(0, 3).map((rf, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-md"
                                                                >
                                                                    {rf.food?.name || `食材ID: ${rf.food_id}`}
                                                                </span>
                                                            ))}
                                                            {foods.length > 3 && (
                                                                <span className="px-2 py-1 text-xs font-bold bg-slate-200 text-slate-600 rounded-md">
                                                                    +{foods.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 border-b border-slate-100">
                                                    {allergens.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {allergens.map((allergen) => (
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
                                                    <span className="text-slate-700">
                                                        {recipe.cooking_time ? `${recipe.cooking_time}分` : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 border-b border-slate-100">
                                                    <span className="text-slate-700">
                                                        {recipe.servings ? `${recipe.servings}人` : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 border-b border-slate-100">
                                                    <span className="text-slate-600">{formatDate(recipe.updated_at)}</span>
                                                </td>
                                                <td className="px-6 py-4 border-b border-slate-100 text-center">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => handleEdit(recipe.id)}
                                                            className="text-sky-600 hover:text-sky-700 transition-colors"
                                                            title="編集"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(recipe)}
                                                            className="text-red-600 hover:text-red-700 transition-colors"
                                                            title="削除"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* 削除確認モーダル */}
                    <ConfirmModal
                        isOpen={deleteModalOpen}
                        title="料理の削除"
                        message={`「${recipeToDelete?.name}」を削除してもよろしいですか？この操作は取り消せません。`}
                        confirmText="削除"
                        cancelText="キャンセル"
                        onConfirm={handleDeleteConfirm}
                        onCancel={handleDeleteCancel}
                        variant="danger"
                    />
                </div>
            </main>
        </div>
    )
}

