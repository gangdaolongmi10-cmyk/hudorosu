import React, { useEffect, useState } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { Food } from '@/types/food';
import { fetchMasterFoods, deleteFood } from '@/services/foodService';
import { fetchCategories } from '@/services/categoryService';
import { fetchAllergens, Allergen } from '@/services/allergenService';
import { Category } from '@/types/category';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export const FoodIndexPage: React.FC = () => {
    const navigate = useNavigate();
    const [foods, setFoods] = useState<Food[]>([]);
    const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [allergens, setAllergens] = useState<Allergen[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
    const [allergenDropdownOpen, setAllergenDropdownOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [foodToDelete, setFoodToDelete] = useState<Food | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const [foodsData, categoriesData, allergensData] = await Promise.all([
                    fetchMasterFoods(),
                    fetchCategories(),
                    fetchAllergens()
                ]);
                setFoods(foodsData);
                setFilteredFoods(foodsData);
                setCategories(categoriesData);
                setAllergens(allergensData);
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
        let filtered = [...foods];

        // カテゴリでフィルタ
        if (selectedCategory !== 'all') {
            const categoryId = parseInt(selectedCategory, 10);
            filtered = filtered.filter(food => food.category_id === categoryId);
        }

        // 食材名で検索
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(food => 
                food.name.toLowerCase().includes(query)
            );
        }

        // アレルゲンでフィルタ
        if (selectedAllergens.length > 0) {
            filtered = filtered.filter(food => {
                if (!food.allergens || food.allergens.length === 0) {
                    return false;
                }
                // 選択されたアレルゲンのいずれかが含まれているかチェック
                return food.allergens.some(allergen => 
                    selectedAllergens.includes(allergen.id)
                );
            });
        }

        setFilteredFoods(filtered);
    }, [selectedCategory, searchQuery, selectedAllergens, foods]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const handleEdit = (id: number) => {
        navigate(`/admin/food/${id}/edit`);
    };

    const handleDeleteClick = (food: Food) => {
        setFoodToDelete(food);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!foodToDelete) return;

        try {
            setIsDeleting(true);
            await deleteFood(foodToDelete.id);
            // 一覧を再読み込み
            const [foodsData, categoriesData, allergensData] = await Promise.all([
                fetchMasterFoods(),
                fetchCategories(),
                fetchAllergens()
            ]);
            setFoods(foodsData);
            setFilteredFoods(foodsData);
            setCategories(categoriesData);
            setAllergens(allergensData);
            setDeleteModalOpen(false);
            setFoodToDelete(null);
        } catch (err: any) {
            console.error('食材削除エラー:', err);
            setError(err.response?.data?.error || '食材の削除に失敗しました');
            setDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setFoodToDelete(null);
    };

    const handleAllergenToggle = (allergenId: number) => {
        setSelectedAllergens(prev => 
            prev.includes(allergenId)
                ? prev.filter(id => id !== allergenId)
                : [...prev, allergenId]
        );
    };

    const handleClearFilters = () => {
        setSelectedCategory('all');
        setSearchQuery('');
        setSelectedAllergens([]);
    };

    const hasActiveFilters = selectedCategory !== 'all' || searchQuery.trim() !== '' || selectedAllergens.length > 0;

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminAside />
            <main className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="flex items-center justify-between">
                        <div>
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/food']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">食材マスタ一覧</h2>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => navigate('/admin/food/create')}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 font-bold">
                                <i className="fas fa-plus text-xs"></i> 新規食材を登録
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
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* 検索・フィルタセクション */}
                            <div className="p-5 border-b border-slate-100 bg-white/50">
                                <div className="flex flex-col gap-4">
                                    {/* 食材名検索 */}
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1 relative">
                                            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="食材名で検索..."
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
                                    </div>

                                    {/* カテゴリ・アレルゲンフィルタ */}
                                    <div className="flex gap-4 flex-wrap items-center">
                                        <div className="flex gap-2 items-center bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                                            <i className="fas fa-filter text-slate-400 text-xs"></i>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer font-bold">
                                                <option value="all">全カテゴリ</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={String(category.id)}>{category.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* アレルゲンフィルタ */}
                                        <div className="relative">
                                            <div className="flex gap-2 items-center bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                                                <i className="fas fa-exclamation-triangle text-slate-400 text-xs"></i>
                                                <button 
                                                    onClick={() => setAllergenDropdownOpen(!allergenDropdownOpen)}
                                                    className="text-sm text-slate-700 font-bold flex items-center gap-2"
                                                >
                                                    アレルゲン
                                                    {selectedAllergens.length > 0 && (
                                                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                            {selectedAllergens.length}
                                                        </span>
                                                    )}
                                                    <i className={`fas fa-chevron-${allergenDropdownOpen ? 'up' : 'down'} text-xs transition-transform`}></i>
                                                </button>
                                            </div>
                                            {allergenDropdownOpen && (
                                                <>
                                                    <div 
                                                        className="fixed inset-0 z-10" 
                                                        onClick={() => setAllergenDropdownOpen(false)}
                                                    ></div>
                                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-3 max-h-64 overflow-y-auto">
                                                        {allergens.length === 0 ? (
                                                            <p className="text-sm text-slate-500">アレルゲンが登録されていません</p>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {allergens.map((allergen) => (
                                                                    <label
                                                                        key={allergen.id}
                                                                        className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedAllergens.includes(allergen.id)}
                                                                            onChange={() => handleAllergenToggle(allergen.id)}
                                                                            className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                                                                        />
                                                                        <span className="text-sm text-slate-700">{allergen.name}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="ml-auto">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                全 {foods.length} 件中 {filteredFoods.length} 件
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {filteredFoods.length === 0 ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <i className="fas fa-database text-6xl text-slate-300 mb-4"></i>
                                        <p className="text-slate-500 text-lg font-medium">マスタ食材がありません</p>
                                    </div>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                                        <tr>
                                            <th className="px-6 py-4 border-b border-slate-100">食材名</th>
                                            <th className="px-6 py-4 border-b border-slate-100">カテゴリ</th>
                                            <th className="px-6 py-4 border-b border-slate-100">特定アレルギー</th>
                                            <th className="px-6 py-4 border-b border-slate-100">最終更新日</th>
                                            <th className="px-6 py-4 border-b border-slate-100 text-center">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredFoods.map((food) => (
                                            <tr key={food.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 border-b border-slate-100">
                                                    <span className="font-bold text-slate-900">{food.name}</span>
                                                </td>
                                                <td className="px-6 py-4 border-b border-slate-100">
                                                    <span className="text-slate-700">{food.category.name}</span>
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
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => handleEdit(food.id)}
                                                            className="text-sky-600 hover:text-sky-700 transition-colors"
                                                            title="編集"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(food)}
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
                            )}
                        </div>
                    )}

                    {/* 削除確認モーダル */}
                    <ConfirmModal
                        isOpen={deleteModalOpen}
                        title="食材の削除"
                        message={`「${foodToDelete?.name}」を削除してもよろしいですか？この操作は取り消せません。`}
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