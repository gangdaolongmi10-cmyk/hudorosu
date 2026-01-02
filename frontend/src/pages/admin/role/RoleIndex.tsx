import React from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { ROLE_PERMISSIONS, ROLE_BADGE_COLORS } from '@/constants/role';

export const RoleIndexPage: React.FC = () => {
    return (
        <div className="flex h-screen bg-slate-50">
            <AdminAside />
            <main className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* ヘッダーセクション */}
                    <div className="flex items-center justify-between">
                        <div>
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/role']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">権限一覧</h2>
                        </div>
                    </div>
                    {/* 権限一覧 */}
                    <div className="space-y-6">
                        {ROLE_PERMISSIONS.map((rolePermission) => (
                            <div key={rolePermission.role} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* ロールヘッダー */}
                                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${ROLE_BADGE_COLORS[rolePermission.role]}`}>
                                            {rolePermission.label}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            ({rolePermission.permissions.length}個の権限)
                                        </span>
                                    </div>
                                </div>

                                {/* 権限リスト */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {rolePermission.permissions.map((permission) => (
                                            <div key={permission.id} className="border border-slate-200 rounded-lg p-4 hover:border-sky-300 hover:shadow-md transition-all">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <i className="fas fa-check-circle text-green-500"></i>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-bold text-slate-900 mb-1">
                                                            {permission.name}
                                                        </h3>
                                                        <p className="text-xs text-slate-600 leading-relaxed">
                                                            {permission.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
