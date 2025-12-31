import React, { useEffect, useState } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { Food } from '@/types/food';
import { fetchMasterFoods } from '@/services/foodService';
import { useNavigate } from 'react-router-dom';

export const FoodIndexPage: React.FC = () => {
    const navigate = useNavigate();
    const [foods, setFoods] = useState<Food[]>([]);
    const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        const loadFoods = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchMasterFoods();
                setFoods(data);
                setFilteredFoods(data);
            } catch (err: any) {
                console.error('食材取得エラー:', err);
                setError(err.response?.data?.error || '食材の取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadFoods();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredFoods(foods);
        } else {
            setFilteredFoods(foods.filter(food => food.category.name === selectedCategory));
        }
    }, [selectedCategory, foods]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const handleEdit = (id: number) => {
        console.log(`Edit food ID: ${id}`);
    };

    const handleDelete = (id: number) => {
        console.log(`Delete food ID: ${id}`);
    };

    // カテゴリ一覧を取得（重複を除去）
    const categories = Array.from(new Set(foods.map(food => food.category.name))).sort();

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminAside />
            <main className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="flex items-center justify-between">
                        <div>
                            <nav className="flex items-center text-sm text-slate-500 gap-2 mb-2 font-medium tracking-wide">
                                <span className="hover:text-sky-600 cursor-pointer" onClick={() => navigate('/admin')}>HOME</span>
                                <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
                                <span className="text-slate-900 font-bold">食材マスタ管理</span>
                            </nav>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">食材マスタ一覧</h2>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { }}
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
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/50">
                                <div className="flex gap-4">
                                    <div className="flex gap-2 items-center bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                                        <i className="fas fa-filter text-slate-400 text-xs"></i>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer font-bold">
                                            <option value="all">全カテゴリ</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {filteredFoods.length} 件
                                </span>
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
                                                            onClick={() => handleDelete(food.id)}
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
                </div>
            </main>
        </div>
    )
}