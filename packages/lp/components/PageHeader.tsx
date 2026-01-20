import React from 'react';

type PageHeaderProps = {
    title: string;
    description?: React.ReactNode;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <header className="common-page-header">
            <div className="max-w-[1200px] mx-auto px-5 md:px-[5%] text-center">
                <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-[#2e7d32] mb-4">
                    {title}
                </h1>
                {description && (
                    <p className="text-[#666] leading-relaxed max-w-[700px] mx-auto">
                        {description}
                    </p>
                )}
            </div>
        </header>
    );
}
