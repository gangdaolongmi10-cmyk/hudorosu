import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { fetchFoodById, updateFood } from '@/services/foodService';
import { fetchCategories } from '@/services/categoryService';
import { fetchAllergens } from '@/services/allergenService';
import { Category } from '@/types/category';
import { Allergen } from '@/services/allergenService';
import { Food } from '@/types/food';

export const FoodEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [food, setFood] = useState<Food | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [allergens, setAllergens] = useState<Allergen[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        best_before_date: '',
        expiry_date: '',
        memo: '',
        allergen_ids: [] as number[],
        calories: '',
        protein: '',
        fat: '',
        carbohydrate: '',
        fiber: '',
        sodium: '',
        serving_size: '',
    });

    useEffect(() => {
        const loadData = async () => {
            if (!id) {
                setError('食材IDが指定されていません');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const [foodData, categoriesData, allergensData] = await Promise.all([
                    fetchFoodById(parseInt(id, 10)),
                    fetchCategories(),
                    fetchAllergens()
                ]);
                
                setFood(foodData);
                setCategories(categoriesData);
                setAllergens(allergensData);

                // 日付フォーマット（YYYY-MM-DD形式に変換）
                const formatDate = (dateString: string | null) => {
                    if (!dateString) return '';
                    const date = new Date(dateString);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                setFormData({
                    name: foodData.name || '',
                    category_id: String(foodData.category_id),
                    best_before_date: formatDate(foodData.best_before_date),
                    expiry_date: formatDate(foodData.expiry_date),
                    memo: foodData.memo || '',
                    allergen_ids: foodData.allergens?.map(a => a.id) || [],
                    calories: foodData.calories ? String(foodData.calories) : '',
                    protein: foodData.protein ? String(foodData.protein) : '',
                    fat: foodData.fat ? String(foodData.fat) : '',
                    carbohydrate: foodData.carbohydrate ? String(foodData.carbohydrate) : '',
                    fiber: foodData.fiber ? String(foodData.fiber) : '',
                    sodium: foodData.sodium ? String(foodData.sodium) : '',
                    serving_size: foodData.serving_size ? String(foodData.serving_size) : '',
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
            setError('食材IDが指定されていません');
            setIsSubmitting(false);
            return;
        }

        // バリデーション
        if (!formData.name || formData.name.trim() === '') {
            setError('食材名を入力してください');
            setIsSubmitting(false);
            return;
        }

        if (!formData.category_id) {
            setError('カテゴリーを選択してください');
            setIsSubmitting(false);
            return;
        }

        try {
            await updateFood(parseInt(id, 10), {
                name: formData.name.trim(),
                category_id: parseInt(formData.category_id, 10),
                best_before_date: formData.best_before_date || null,
                expiry_date: formData.expiry_date || null,
                memo: formData.memo.trim() || null,
                allergen_ids: formData.allergen_ids.length > 0 ? formData.allergen_ids : [],
                calories: formData.calories ? parseFloat(formData.calories) : null,
                protein: formData.protein ? parseFloat(formData.protein) : null,
                fat: formData.fat ? parseFloat(formData.fat) : null,
                carbohydrate: formData.carbohydrate ? parseFloat(formData.carbohydrate) : null,
                fiber: formData.fiber ? parseFloat(formData.fiber) : null,
                sodium: formData.sodium ? parseFloat(formData.sodium) : null,
                serving_size: formData.serving_size ? parseFloat(formData.serving_size) : null,
            });
            
            // 成功したら食材一覧に戻る
            navigate('/admin/food');
        } catch (err: any) {
            console.error('食材更新エラー:', err);
            setError(err.response?.data?.error || '食材の更新に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/food');
    };

    const handleAllergenToggle = (allergenId: number) => {
        setFormData(prev => ({
            ...prev,
            allergen_ids: prev.allergen_ids.includes(allergenId)
                ? prev.allergen_ids.filter(id => id !== allergenId)
                : [...prev.allergen_ids, allergenId]
        }));
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
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/food/:id/edit']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">食材編集</h2>
                        </div>
                    </div>

                    {/* フラッシュメッセージ */}
                    <FlashMessage
                        message={error}
                        type="error"
                        onClose={() => setError(null)}
                    />

                    {/* 現在の栄養素情報表示セクション */}
                    {food && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                                <h3 className="text-lg font-bold text-slate-900">現在の栄養素情報（100gあたり）</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">カロリー</div>
                                        <div className="text-xl font-bold text-slate-900">
                                            {food.calories !== null && food.calories !== undefined 
                                                ? `${typeof food.calories === 'string' ? parseFloat(food.calories).toFixed(1) : food.calories.toFixed(1)} kcal`
                                                : '-'}
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">タンパク質</div>
                                        <div className="text-xl font-bold text-blue-900">
                                            {food.protein !== null && food.protein !== undefined 
                                                ? `${typeof food.protein === 'string' ? parseFloat(food.protein).toFixed(1) : food.protein.toFixed(1)} g`
                                                : '-'}
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-4">
                                        <div className="text-xs text-yellow-600 font-bold uppercase tracking-widest mb-1">脂質</div>
                                        <div className="text-xl font-bold text-yellow-900">
                                            {food.fat !== null && food.fat !== undefined 
                                                ? `${typeof food.fat === 'string' ? parseFloat(food.fat).toFixed(1) : food.fat.toFixed(1)} g`
                                                : '-'}
                                        </div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="text-xs text-green-600 font-bold uppercase tracking-widest mb-1">炭水化物</div>
                                        <div className="text-xl font-bold text-green-900">
                                            {food.carbohydrate !== null && food.carbohydrate !== undefined 
                                                ? `${typeof food.carbohydrate === 'string' ? parseFloat(food.carbohydrate).toFixed(1) : food.carbohydrate.toFixed(1)} g`
                                                : '-'}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="text-xs text-purple-600 font-bold uppercase tracking-widest mb-1">食物繊維</div>
                                        <div className="text-xl font-bold text-purple-900">
                                            {food.fiber !== null && food.fiber !== undefined 
                                                ? `${typeof food.fiber === 'string' ? parseFloat(food.fiber).toFixed(1) : food.fiber.toFixed(1)} g`
                                                : '-'}
                                        </div>
                                    </div>
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <div className="text-xs text-orange-600 font-bold uppercase tracking-widest mb-1">ナトリウム</div>
                                        <div className="text-xl font-bold text-orange-900">
                                            {food.sodium !== null && food.sodium !== undefined 
                                                ? `${typeof food.sodium === 'string' ? parseFloat(food.sodium).toFixed(1) : food.sodium.toFixed(1)} mg`
                                                : '-'}
                                        </div>
                                    </div>
                                    <div className="bg-indigo-50 rounded-lg p-4">
                                        <div className="text-xs text-indigo-600 font-bold uppercase tracking-widest mb-1">1食分の量</div>
                                        <div className="text-xl font-bold text-indigo-900">
                                            {food.serving_size !== null && food.serving_size !== undefined 
                                                ? `${typeof food.serving_size === 'string' ? parseFloat(food.serving_size).toFixed(1) : food.serving_size.toFixed(1)} g`
                                                : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* フォーム */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-900">食材情報</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        食材名 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="食材名を入力"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        カテゴリー <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">カテゴリーを選択</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            賞味期限
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.best_before_date}
                                            onChange={(e) => setFormData({ ...formData, best_before_date: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            消費期限
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.expiry_date}
                                            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        特定アレルギー
                                    </label>
                                    <div className="border border-slate-300 rounded-lg p-4 max-h-48 overflow-y-auto">
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
                                                            checked={formData.allergen_ids.includes(allergen.id)}
                                                            onChange={() => handleAllergenToggle(allergen.id)}
                                                            className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                                                        />
                                                        <span className="text-sm text-slate-700">{allergen.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        メモ
                                    </label>
                                    <textarea
                                        value={formData.memo}
                                        onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="メモを入力（任意）"
                                        rows={4}
                                    />
                                </div>

                                {/* 栄養素セクション */}
                                <div className="border-t border-slate-200 pt-6">
                                    <h4 className="text-md font-bold text-slate-900 mb-4">栄養素情報（100gあたり）</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                カロリー (kcal)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.calories}
                                                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="例: 100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                タンパク質 (g)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.protein}
                                                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="例: 20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                脂質 (g)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.fat}
                                                onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="例: 10"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                炭水化物 (g)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.carbohydrate}
                                                onChange={(e) => setFormData({ ...formData, carbohydrate: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="例: 50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                食物繊維 (g)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.fiber}
                                                onChange={(e) => setFormData({ ...formData, fiber: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="例: 5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                ナトリウム (mg)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.sodium}
                                                onChange={(e) => setFormData({ ...formData, sodium: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="例: 500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                1食分の量 (g)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.serving_size}
                                                onChange={(e) => setFormData({ ...formData, serving_size: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                                placeholder="例: 150"
                                            />
                                        </div>
                                    </div>
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

