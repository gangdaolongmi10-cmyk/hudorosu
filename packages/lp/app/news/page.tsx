import Link from 'next/link';
import { getAllNews } from '../../lib/news';
import PageHeader from '../../components/PageHeader';

export const metadata = {
    title: 'お知らせ | ふどろす',
    description: 'ふどろすの最新情報、アップデート、メンテナンス情報などをお知らせします。',
};

export default function NewsIndexPage() {
    const allNews = getAllNews();

    return (
        <div className="min-h-screen bg-[#fffcf9] pt-[calc(64px+20px)]">
            <PageHeader
                title="お知らせ"
                description="最新のアップデート情報やニュースをお届けします"
            />

            {/* News List */}
            <div className="max-w-[1200px] mx-auto px-5 md:px-[5%] py-12 md:py-20">
                {allNews.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {allNews.map((post) => (
                                <li key={post.slug} className="group hover:bg-gray-50 transition-colors">
                                    <Link href={`/news/${post.slug}`} className="block p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="md:w-32 flex-shrink-0">
                                            <time className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{post.date}</time>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-[#4caf50] transition-colors mb-2 md:mb-0">
                                                {post.title}
                                            </h2>
                                            {post.description && (
                                                <p className="text-gray-500 text-sm md:hidden mt-2 line-clamp-2">
                                                    {post.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="hidden md:block text-gray-400">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p>お知らせはまだありません。</p>
                    </div>
                )}
            </div>
        </div>
    );
}
