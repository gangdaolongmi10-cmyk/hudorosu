import type { Metadata } from 'next'
import BackButton from '@/components/BackButton'

export const metadata: Metadata = {
    title: '利用規約 | ふどろす',
    description: 'ふどろすの利用規約です。本サービスをご利用いただく際の条件を記載しています。',
}

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-[5%]">
            <div className="max-w-[800px] mx-auto">
                <div className="mb-8">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-[#2e7d32] mb-10 border-b pb-4">利用規約</h1>

                <section className="space-y-8 text-[#444] leading-relaxed">
                    <div>
                        <p className="mb-4">
                            この利用規約（以下、「本規約」といいます。）は、ふどろす開発チーム（以下、「当チーム」といいます。）が提供するサービス「ふどろす」（以下、「本サービス」といいます。）の利用条件を定めるものです。ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って本サービスをご利用いただきます。
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#2e7d32] mb-4">第1条（適用）</h2>
                        <p>
                            本規約は、ユーザーと当チームとの間の本サービスの利用に関わる一切の関係に適用されるものとします。
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#2e7d32] mb-4">第2条（利用登録）</h2>
                        <p>
                            本サービスにおいては、登録希望者が本規約に同意の上、当チームの定める方法によって利用登録を申請し、当チームがこれを承認することによって、利用登録が完了するものとします。
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#2e7d32] mb-4">第3条（禁止事項）</h2>
                        <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>法令または公序良俗に違反する行為</li>
                            <li>犯罪行為に関連する行為</li>
                            <li>当チームのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                            <li>当チームのサービスの運営を妨害するおそれのある行為</li>
                            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                            <li>他のユーザーに成りすます行為</li>
                            <li>当チームのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                            <li>その他、当チームが不適切と判断する行為</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#2e7d32] mb-4">第4条（本サービスの提供の停止等）</h2>
                        <p>
                            当チームは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                            <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                            <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                            <li>その他、当チームが本サービスの提供が困難と判断した場合</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#2e7d32] mb-4">第5条（利用制限および登録抹消）</h2>
                        <p>
                            当チームは、ユーザーが本規約のいずれかの条項に違反した場合、事前の通知をすることなく、ユーザーに対して本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#2e7d32] mb-4">第6条（免責事項）</h2>
                        <p>
                            当チームの債務不履行責任は、当チームの故意または重過失によらない限り免責されるものとします。当チームは、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#2e7d32] mb-4">第7条（サービス内容の変更等）</h2>
                        <p>
                            当チームは、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#2e7d32] mb-4">第8条（利用規約の変更）</h2>
                        <p>
                            当チームは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#2e7d32] mb-4">第9条（個人情報の取扱い）</h2>
                        <p>
                            当チームは、本サービスの利用によって取得する個人情報については、当チーム「プライバシーポリシー」に従い適切に取り扱うものとします。
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#2e7d32] mb-4">第10条（準拠法・裁判管轄）</h2>
                        <p>
                            本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当チームの所在地を管轄する裁判所を専属的合意管轄とします。
                        </p>
                    </div>

                    <p className="text-right mt-10">
                        以上
                    </p>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                        <BackButton />
                    </div>
                </section>
            </div>
        </main>
    )
}
