import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { fetchStats, StatsResponse } from '@/services/statsService';

export const AdminTopPage: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<StatsResponse>({
        totalFoods: 0,
        totalCategories: 0,
        totalUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchStats();
                setStats(data);
            } catch (error) {
                console.error('統計情報の取得に失敗しました:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

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
                                <span className="text-slate-900 font-bold">HOME</span>
                            </nav>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">ダッシュボード</h2>
                        </div>
                    </div>

                    {/* 統計カード */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 shadow-lg shadow-sky-100">
                                    <i className="fas fa-database text-xl"></i>
                                </div>
                                <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">食材</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-extrabold text-slate-900">
                                    {loading ? '...' : stats.totalFoods}
                                </p>
                                <p className="text-sm text-slate-500">登録済み食材数</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/food')}
                                className="mt-4 w-full text-left text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1"
                            >
                                食材マスタを確認 <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-100">
                                    <i className="fas fa-tags text-xl"></i>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">カテゴリ</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-extrabold text-slate-900">
                                    {loading ? '...' : stats.totalCategories}
                                </p>
                                <p className="text-sm text-slate-500">登録済みカテゴリ数</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/category')}
                                className="mt-4 w-full text-left text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
                            >
                                カテゴリ管理を確認 <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shadow-lg shadow-purple-100">
                                    <i className="fas fa-users text-xl"></i>
                                </div>
                                <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">ユーザー</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-extrabold text-slate-900">
                                    {loading ? '...' : stats.totalUsers}
                                </p>
                                <p className="text-sm text-slate-500">一般ユーザー数</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/user')}
                                className="mt-4 w-full text-left text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
                            >
                                ユーザー管理を確認 <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    {/* クイックアクセス */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">クイックアクセス</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ADMIN_NAV_ITEMS.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-sky-200 hover:bg-sky-50 transition-all text-left group"
                                >
                                    <div className="w-10 h-10 bg-slate-100 group-hover:bg-sky-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:text-sky-600 transition-colors">
                                        <i className={`${item.icon} text-lg`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {item.label === '食材マスタ' ? '食材データの管理' : 'カテゴリの管理'}
                                        </p>
                                    </div>
                                    <i className="fas fa-chevron-right text-slate-300 group-hover:text-sky-600 transition-colors"></i>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
