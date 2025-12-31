import React, { useEffect, useState } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { Category } from '@/types/category';
import { fetchCategories } from '@/services/categoryService';
import { useNavigate } from 'react-router-dom';

export const CategoryIndexPage: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const handleEdit = (id: number) => {
        console.log(`Edit category ID: ${id}`);
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
                            <nav className="flex items-center text-sm text-slate-500 gap-2 mb-2 font-medium tracking-wide">
                                <span className="hover:text-sky-600 cursor-pointer">HOME</span>
                                <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
                                <span className="text-slate-900 font-bold">カテゴリ管理</span>
                            </nav>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">カテゴリ一覧</h2>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-2.5 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 font-bold">
                                <i className="fas fa-plus text-xs"></i> 新規カテゴリを追加
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
                    ) : categories.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <i className="fas fa-folder-open text-6xl text-slate-300 mb-4"></i>
                                <p className="text-slate-500 text-lg font-medium">カテゴリーがありません</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) => (
                                <div key={category.id} onClick={() => navigate('/admin/category/edit/' + category.id)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-sky-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-inner`}>
                                            <i className="fas fa-folder-open text-xl"></i>
                                        </div>
                                        <button onClick={(e) => {e.stopPropagation(); handleEdit(category.id);}} className="text-slate-300 hover:text-slate-600 transition-colors">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-sky-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    {category.description && (
                                        <p className="text-sm text-slate-500 mb-2">
                                            {category.description}
                                        </p>
                                    )}
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                        11 アイテム
                                    </p>
                                    <div className="mt-6 flex items-center text-xs font-bold text-sky-600 gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                        このカテゴリの詳細を見る <i className="fas fa-arrow-right"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};