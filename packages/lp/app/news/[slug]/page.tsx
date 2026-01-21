import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getNewsBySlug, getAllNews } from '../../../lib/news';
import { ArrowLeft, Calendar } from 'lucide-react';
import type { Metadata } from 'next';
import Breadcrumb from '../../../components/Breadcrumb';

type Props = {
    params: {
        slug: string;
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = getNewsBySlug(params.slug);

    if (!post) {
        return {
            title: 'お知らせが見つかりません | ふどろす',
        };
    }

    return {
        title: `${post.title} | お知らせ | ふどろす`,
        description: post.description,
    };
}

export async function generateStaticParams() {
    const posts = getAllNews();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default function NewsPostPage({ params }: Props) {
    const post = getNewsBySlug(params.slug);

    if (!post) {
        notFound();
    }

    const breadcrumbItems = [
        { label: 'ホーム', href: '/' },
        { label: 'お知らせ', href: '/news' },
        { label: post.title },
    ];

    return (
        <div className="min-h-screen bg-[#fffcf9] pb-20">
            {/* Header / Nav */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10 pt-[64px]">
                <div className="max-w-[1200px] mx-auto px-5 md:px-8 lg:px-12 h-16 flex items-center">
                    <Link href="/news" className="flex items-center text-gray-600 hover:text-[#4caf50] transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        お知らせ一覧に戻る
                    </Link>
                </div>
            </div>

            <Breadcrumb items={breadcrumbItems} />

            <article className="max-w-[1200px] mx-auto px-5 md:px-[5%] py-12">
                {/* Article Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-2 text-gray-500 mb-4 bg-gray-100 inline-flex px-3 py-1 rounded-full text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        <time>{post.date}</time>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                        {post.title}
                    </h1>
                </header>

                {/* Content */}
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                    <div className="markdown-content">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-8 mb-4 border-l-4 border-[#4caf50] pl-4" {...(props as any)} />,
                                h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-8 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2" {...(props as any)} />,
                                h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-6 mb-3" {...(props as any)} />,
                                p: ({ node, ...props }) => <p className="mb-6 leading-relaxed text-gray-700" {...(props as any)} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 bg-gray-50 p-6 rounded-xl" {...(props as any)} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700 bg-gray-50 p-6 rounded-xl" {...(props as any)} />,
                                li: ({ node, ...props }) => <li className="pl-2" {...(props as any)} />,
                                a: ({ node, ...props }) => <a className="text-[#4caf50] hover:underline font-medium" {...(props as any)} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-200 pl-4 py-2 italic text-gray-600 mb-6 bg-gray-50 pr-4 rounded-r-lg" {...(props as any)} />,
                                strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...(props as any)} />,
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>

            {/* Footer Nav */}
            <div className="max-w-[800px] mx-auto px-4 mt-8 flex justify-center">
                <Link href="/news" className="px-8 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 hover:text-[#4caf50] transition-all font-medium shadow-sm hover:shadow-md">
                    お知らせ一覧へ
                </Link>
            </div>
        </div>
    );
}
