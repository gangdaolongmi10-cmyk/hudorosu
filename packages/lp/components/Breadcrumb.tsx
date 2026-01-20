import React from 'react';
import Link from 'next/link';

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
    if (!items || items.length === 0) return null;

    return (
        <nav className="breadcrumb" aria-label="パンくずリスト">
            <div className="max-w-[1200px] mx-auto px-5 md:px-[5%]">
                <ol className="breadcrumb-list">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <li key={index} aria-current={isLast ? 'page' : undefined}>
                                {!isLast && item.href ? (
                                    <Link href={item.href}>
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span>{item.label}</span>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
}
