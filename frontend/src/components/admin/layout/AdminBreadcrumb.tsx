import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getBreadcrumbItems } from '@/constants/breadcrumb';

export interface BreadcrumbItem {
    label: string;
    path?: string; // パスが指定されていない場合はクリック不可
}

interface AdminBreadcrumbProps {
    items?: BreadcrumbItem[]; // オプショナルに変更。指定されない場合は現在のパスから自動取得
}

export const AdminBreadcrumb: React.FC<AdminBreadcrumbProps> = ({ items }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // itemsが指定されていない場合は、現在のパスから自動取得
    const breadcrumbItems = items || getBreadcrumbItems(location.pathname);

    // HOMEを常に最初に追加
    const allItems: BreadcrumbItem[] = [
        { label: 'HOME', path: '/admin' },
        ...breadcrumbItems
    ];

    return (
        <nav className="flex items-center text-sm text-slate-500 gap-2 mb-2 font-medium tracking-wide">
            {allItems.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && (
                        <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
                    )}
                    {item.path ? (
                        <span
                            className="hover:text-sky-600 cursor-pointer"
                            onClick={() => navigate(item.path!)}
                        >
                            {item.label}
                        </span>
                    ) : (
                        <span className="text-slate-900 font-bold">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

