'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ArrowLeft, Mail, Lock, User, ShoppingCart, Loader2 } from 'lucide-react'

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // 実際にはAPIでユーザー作成を行いますが、今回はデモなので直接signInに進みます
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('アカウントの作成に失敗しました')
                setIsLoading(false)
            } else {
                router.push('/')
                router.refresh()
            }
        } catch (err) {
            setError('エラーが発生しました。もう一度お試しください。')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#e8f5e9] rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fff8e1] rounded-full blur-[100px] opacity-60" />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#2e7d32] transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    トップページへ戻る
                </Link>

                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-[#2e7d32]" />
                    </div>
                </div>

                <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    アカウント作成
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    ふどろすを始めて、賢く食材を管理しましょう
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-white">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                メールアドレス
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#66bb6a] focus:border-transparent sm:text-sm transition-all"
                                    placeholder="your@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                パスワード
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#66bb6a] focus:border-transparent sm:text-sm transition-all"
                                    placeholder="8文字以上"
                                />
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 leading-relaxed">
                            登録することで、当サービスの
                            <Link href="/terms" className="text-[#2e7d32] underline mx-1">利用規約</Link>
                            と
                            <Link href="/privacy" className="text-[#2e7d32] underline mx-1">プライバシーポリシー</Link>
                            に同意したものとみなされます。
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-[#66bb6a] to-[#2e7d32] hover:from-[#2e7d32] hover:to-[#1b5e20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66bb6a] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'アカウントを作成する'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    すでにアカウントをお持ちですか？
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                href="/login"
                                className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-2xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all no-underline"
                            >
                                ログインはこちら
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    &copy; 2026 ふどろす 開発チーム. All rights reserved.
                </p>
            </div>
        </div>
    )
}
