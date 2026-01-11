import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { fetchRecipeById, updateRecipe, Recipe, Allergen } from '@/services/recipeService';
import { fetchMasterFoods } from '@/services/foodService';
import { Food } from '@/types/food';
import { fetchCategories } from '@/services/categoryService';
import { Category } from '@/types/category';

interface SelectedFood {
    food_id: number;
    quantity: string;
    food: Food;
}

export const RecipeEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [foods, setFoods] = useState<Food[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [foodSearchQuery, setFoodSearchQuery] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
    const [foodDropdownOpen, setFoodDropdownOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        cooking_time: '',
        servings: '',
        instructions: '',
    });

    const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);

    useEffect(() => {
        const loadData = async () => {
            if (!id) {
                setError('料理IDが指定されていません');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const [recipeData, foodsData, categoriesData] = await Promise.all([
                    fetchRecipeById(parseInt(id, 10)),
                    fetchMasterFoods(),
                    fetchCategories()
                ]);
                
                setRecipe(recipeData);
                setFoods(foodsData);
                setCategories(categoriesData);

                setFormData({
                    name: recipeData.name || '',
                    description: recipeData.description || '',
                    image_url: recipeData.image_url || '',
                    cooking_time: recipeData.cooking_time ? String(recipeData.cooking_time) : '',
                    servings: recipeData.servings ? String(recipeData.servings) : '',
                    instructions: recipeData.instructions || '',
                });

                // 既存の食材を設定
                if (recipeData.food_id_foods) {
                    setSelectedFoods(recipeData.food_id_foods.map(rf => {
                        const food = rf.food ? {
                            id: rf.food.id,
                            name: rf.food.name,
                            category_id: rf.food.category_id,
                            allergens: rf.food.allergens || []
                        } : foodsData.find(f => f.id === rf.food_id);
                        
                        if (!food) {
                            throw new Error(`Food with id ${rf.food_id} not found`);
                        }
                        
                        return {
                            food_id: rf.food_id,
                            quantity: rf.quantity || '',
                            food: food as Food
                        };
                    }));
                }
            } catch (err: any) {
                console.error('データ取得エラー:', err);
                setError(err.response?.data?.error || 'データの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id]);

    const filteredFoods = foods.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(foodSearchQuery.toLowerCase());
        const matchesCategory = selectedCategoryFilter === 'all' || food.category_id === parseInt(selectedCategoryFilter, 10);
        const notSelected = !selectedFoods.some(sf => sf.food_id === food.id);
        return matchesSearch && matchesCategory && notSelected;
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!id) {
            setError('料理IDが指定されていません');
            setIsSubmitting(false);
            return;
        }

        // バリデーション
        if (!formData.name || formData.name.trim() === '') {
            setError('料理名を入力してください');
            setIsSubmitting(false);
            return;
        }

        try {
            await updateRecipe(parseInt(id, 10), {
                name: formData.name.trim(),
                description: formData.description.trim() || null,
                image_url: formData.image_url.trim() || null,
                cooking_time: formData.cooking_time ? parseInt(formData.cooking_time, 10) : null,
                servings: formData.servings ? parseInt(formData.servings, 10) : null,
                instructions: formData.instructions.trim() || null,
                foods: selectedFoods.map(sf => ({
                    food_id: sf.food_id,
                    quantity: sf.quantity.trim() || null
                }))
            });
            
            // 成功したら料理一覧に戻る
            navigate('/admin/recipe');
        } catch (err: any) {
            console.error('料理更新エラー:', err);
            setError(err.response?.data?.error || '料理の更新に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/recipe');
    };

    const handleAddFood = (food: Food) => {
        if (!selectedFoods.some(sf => sf.food_id === food.id)) {
            setSelectedFoods([...selectedFoods, {
                food_id: food.id,
                quantity: '',
                food
            }]);
            setFoodSearchQuery('');
            setFoodDropdownOpen(false);
        }
    };

    const handleRemoveFood = (foodId: number) => {
        setSelectedFoods(selectedFoods.filter(sf => sf.food_id !== foodId));
    };

    const handleQuantityChange = (foodId: number, quantity: string) => {
        setSelectedFoods(selectedFoods.map(sf => 
            sf.food_id === foodId ? { ...sf, quantity } : sf
        ));
    };

    // 選択された食材からアレルギーを収集
    const getAllergens = () => {
        const allergenMap = new Map<number, { id: number; name: string }>();
        selectedFoods.forEach(sf => {
            if (sf.food.allergens) {
                sf.food.allergens.forEach((allergen: Allergen) => {
                    if (!allergenMap.has(allergen.id)) {
                        allergenMap.set(allergen.id, allergen);
                    }
                });
            }
        });
        return Array.from(allergenMap.values());
    };

    const allergens = getAllergens();

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

    if (!recipe) {
        return (
            <div className="flex h-screen bg-slate-50">
                <AdminAside />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <AdminHeader />
                    <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <p className="font-medium">料理が見つかりません</p>
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
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/recipe/:id/edit']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">料理編集</h2>
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
                            <h3 className="text-lg font-bold text-slate-900">料理情報</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        料理名 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="料理名を入力"
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
                                        placeholder="料理の説明を入力（任意）"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            調理時間（分）
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.cooking_time}
                                            onChange={(e) => setFormData({ ...formData, cooking_time: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            placeholder="例: 30"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            人数
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.servings}
                                            onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            placeholder="例: 4"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        画像URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        作り方
                                    </label>
                                    <textarea
                                        value={formData.instructions}
                                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="作り方を入力（任意）"
                                        rows={6}
                                    />
                                </div>

                                {/* 使用食材セクション */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        使用食材
                                    </label>
                                    
                                    {/* 食材追加UI */}
                                    <div className="relative mb-4">
                                        <div className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                                                <input
                                                    type="text"
                                                    value={foodSearchQuery}
                                                    onChange={(e) => {
                                                        setFoodSearchQuery(e.target.value);
                                                        setFoodDropdownOpen(true);
                                                    }}
                                                    onFocus={() => setFoodDropdownOpen(true)}
                                                    className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                                                    placeholder="食材を検索して追加..."
                                                />
                                            </div>
                                            <select
                                                value={selectedCategoryFilter}
                                                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                                                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                                            >
                                                <option value="all">全カテゴリ</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        {/* 食材ドロップダウン */}
                                        {foodDropdownOpen && filteredFoods.length > 0 && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-10" 
                                                    onClick={() => setFoodDropdownOpen(false)}
                                                ></div>
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                                                    {filteredFoods.map((food) => (
                                                        <button
                                                            key={food.id}
                                                            type="button"
                                                            onClick={() => handleAddFood(food)}
                                                            className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-medium text-slate-900">{food.name}</span>
                                                                <span className="text-xs text-slate-500">{food.category.name}</span>
                                                            </div>
                                                            {food.allergens && food.allergens.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {food.allergens.map((allergen: Allergen) => (
                                                                        <span
                                                                            key={allergen.id}
                                                                            className="px-1.5 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded"
                                                                        >
                                                                            {allergen.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* 選択された食材リスト */}
                                    {selectedFoods.length > 0 && (
                                        <div className="space-y-2 border border-slate-300 rounded-lg p-4">
                                            {selectedFoods.map((sf) => (
                                                <div key={sf.food_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-slate-900">{sf.food.name}</span>
                                                            {sf.food.allergens && sf.food.allergens.length > 0 && (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {sf.food.allergens.map((allergen: Allergen) => (
                                                                        <span
                                                                            key={allergen.id}
                                                                            className="px-1.5 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded"
                                                                        >
                                                                            {allergen.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={sf.quantity}
                                                            onChange={(e) => handleQuantityChange(sf.food_id, e.target.value)}
                                                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                            placeholder="分量（例: 200g, 1個）"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFood(sf.food_id)}
                                                        className="text-red-600 hover:text-red-700 transition-colors"
                                                        title="削除"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* アレルギー表示 */}
                                    {allergens.length > 0 && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="text-sm font-bold text-red-700 mb-2">
                                                <i className="fas fa-exclamation-triangle mr-2"></i>
                                                この料理に含まれるアレルギー物質
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {allergens.map((allergen) => (
                                                    <span
                                                        key={allergen.id}
                                                        className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-md"
                                                    >
                                                        {allergen.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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

