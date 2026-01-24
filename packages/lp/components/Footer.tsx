import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-[#f9fafb] border-t border-gray-100 py-12 px-4 md:px-[5%]">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <p className="font-bold text-[#2e7d32] mb-2 text-lg">ふどろす Project</p>
                    <p className="text-gray-500 text-sm">食材管理と予算で決まるレシピ提案アプリ</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    <Link href="/terms" className="text-gray-500 hover:text-[#2e7d32] transition-colors text-sm font-medium">
                        利用規約
                    </Link>
                    <Link href="/privacy" className="text-gray-500 hover:text-[#2e7d32] transition-colors text-sm font-medium">
                        プライバシーポリシー
                    </Link>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                <p className="text-gray-400 text-xs">&copy; 2026 ふどろす Project. All rights reserved.</p>
            </div>
        </footer>
    )
}