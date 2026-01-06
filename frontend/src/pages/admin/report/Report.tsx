import React, { useEffect, useState, useRef } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { fetchStats } from '@/services/statsService';
import { fetchStocksStats } from '@/services/stockService';
import { fetchUsers } from '@/services/userService';

export const ReportPage: React.FC = () => {
    const [stats, setStats] = useState({
        totalCategories: 0,
        totalFoods: 0,
        totalUsers: 0
    });
    const [stocksStats, setStocksStats] = useState({
        totalStocks: 0,
        userStockCounts: {} as Record<number, number>,
        storageTypeCounts: {
            refrigerator: 0,
            freezer: 0,
            pantry: 0
        },
        expiredCount: 0,
        expiringSoonCount: 0
    });
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const [statsData, stocksStatsData, usersData] = await Promise.all([
                    fetchStats(),
                    fetchStocksStats(),
                    fetchUsers()
                ]);
                
                setStats(statsData);
                setStocksStats(stocksStatsData);
                setUsers(usersData);
            } catch (err: any) {
                console.error('データ取得エラー:', err);
                setError(err.response?.data?.error || 'データの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getUserName = (userId: number) => {
        const user = users.find(u => u.id === userId);
        return user ? (user.name || user.email) : `ユーザーID: ${userId}`;
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
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/report']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">帳票</h2>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 font-bold"
                        >
                            <i className="fas fa-print"></i> 印刷
                        </button>
                    </div>

                    {/* フラッシュメッセージ */}
                    <FlashMessage
                        message={error}
                        type="error"
                        onClose={() => setError(null)}
                    />

                    {/* ローディング状態 */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3 text-slate-500">
                                <i className="fas fa-spinner fa-spin text-2xl"></i>
                                <span className="text-lg font-medium">読み込み中...</span>
                            </div>
                        </div>
                    ) : (
                        <div ref={printRef} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 print:p-4 print:border-0 print:shadow-none">
                            {/* 印刷用スタイル */}
                            <style>{`
                                @media print {
                                    body * {
                                        visibility: hidden;
                                    }
                                    .print-content, .print-content * {
                                        visibility: visible;
                                    }
                                    .print-content {
                                        position: absolute;
                                        left: 0;
                                        top: 0;
                                        width: 100%;
                                    }
                                    .no-print {
                                        display: none !important;
                                    }
                                }
                            `}</style>

                            {/* 帳票ヘッダー */}
                            <div className="mb-8 pb-6 border-b-2 border-slate-300">
                                <h1 className="text-4xl font-bold text-slate-900 mb-2">システム統計レポート</h1>
                                <p className="text-slate-600">発行日: {formatDate(new Date())}</p>
                            </div>

                            {/* 基本統計 */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                                    基本統計
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                        <div className="text-sm text-slate-600 mb-2">登録カテゴリ数</div>
                                        <div className="text-3xl font-bold text-slate-900">{stats.totalCategories}</div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                        <div className="text-sm text-slate-600 mb-2">登録食材数</div>
                                        <div className="text-3xl font-bold text-slate-900">{stats.totalFoods}</div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                        <div className="text-sm text-slate-600 mb-2">一般ユーザー数</div>
                                        <div className="text-3xl font-bold text-slate-900">{stats.totalUsers}</div>
                                    </div>
                                </div>
                            </section>

                            {/* 在庫統計 */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                                    在庫統計
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                        <div className="text-sm text-slate-600 mb-2">総在庫数</div>
                                        <div className="text-3xl font-bold text-slate-900">{stocksStats.totalStocks}</div>
                                    </div>
                                    <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                                        <div className="text-sm text-red-600 mb-2">期限切れ在庫</div>
                                        <div className="text-3xl font-bold text-red-700">{stocksStats.expiredCount}</div>
                                    </div>
                                    <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                                        <div className="text-sm text-yellow-600 mb-2">期限間近在庫（3日以内）</div>
                                        <div className="text-3xl font-bold text-yellow-700">{stocksStats.expiringSoonCount}</div>
                                    </div>
                                </div>

                                {/* 保存タイプ別統計 */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">保存タイプ別在庫数</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                            <div className="text-sm text-blue-600 mb-1">冷蔵庫</div>
                                            <div className="text-2xl font-bold text-blue-700">{stocksStats.storageTypeCounts.refrigerator}</div>
                                        </div>
                                        <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-200">
                                            <div className="text-sm text-cyan-600 mb-1">冷凍庫</div>
                                            <div className="text-2xl font-bold text-cyan-700">{stocksStats.storageTypeCounts.freezer}</div>
                                        </div>
                                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                                            <div className="text-sm text-amber-600 mb-1">常温</div>
                                            <div className="text-2xl font-bold text-amber-700">{stocksStats.storageTypeCounts.pantry}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* ユーザー別在庫数 */}
                                {Object.keys(stocksStats.userStockCounts).length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">ユーザー別在庫数</h3>
                                        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-slate-100 border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">ユーザー</th>
                                                        <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">在庫数</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-200">
                                                    {Object.entries(stocksStats.userStockCounts)
                                                        .sort(([, a], [, b]) => b - a)
                                                        .map(([userId, count]) => (
                                                            <tr key={userId} className="hover:bg-slate-50">
                                                                <td className="px-4 py-3 text-sm text-slate-900">
                                                                    {getUserName(Number(userId))}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-slate-900 text-right font-bold">
                                                                    {count}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* フッター */}
                            <div className="mt-8 pt-6 border-t-2 border-slate-300 text-center text-sm text-slate-600">
                                <p>このレポートは {formatDate(new Date())} 時点のデータに基づいています。</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

