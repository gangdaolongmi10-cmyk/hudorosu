import React, { useEffect, useState } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { fetchLoginLogs, LoginLog, LoginLogsResponse } from '@/services/loginLogService';
import { useNavigate } from 'react-router-dom';

export const LoginLogIndexPage: React.FC = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState<LoginLog[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [limit] = useState(100);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data: LoginLogsResponse = await fetchLoginLogs(limit, offset);
                setLogs(data.logs);
                setTotalCount(data.totalCount);
            } catch (err: any) {
                console.error('ログインログ取得エラー:', err);
                setError(err.response?.data?.error || 'ログインログの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadLogs();
    }, [limit, offset]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatLoginMethod = (method: string | null) => {
        if (!method) return '-';
        return method === 'google' ? 'Google' : method === 'local' ? 'ローカル' : method;
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
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/login-logs']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">ログインログ一覧</h2>
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
                    ) : logs.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <i className="fas fa-history text-6xl text-slate-300 mb-4"></i>
                                <p className="text-slate-500 text-lg font-medium">ログインログがありません</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/50">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        全 {totalCount} 件（表示: {logs.length} 件）
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                                            <tr>
                                                <th className="px-6 py-4 border-b border-slate-100">日時</th>
                                                <th className="px-6 py-4 border-b border-slate-100">ユーザー</th>
                                                <th className="px-6 py-4 border-b border-slate-100">ログイン方法</th>
                                                <th className="px-6 py-4 border-b border-slate-100">IPアドレス</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 border-b border-slate-100">
                                                        <span className="text-slate-700">{formatDate(log.created_at)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 border-b border-slate-100">
                                                        {log.user ? (
                                                            <div>
                                                                <div className="font-bold text-slate-900">{log.user.name || log.user.email}</div>
                                                                <div className="text-xs text-slate-500">{log.user.email}</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 border-b border-slate-100">
                                                        <span className="text-slate-700">{formatLoginMethod(log.login_method)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 border-b border-slate-100">
                                                        <span className="text-slate-700 font-mono text-xs">{log.ip_address || '-'}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

