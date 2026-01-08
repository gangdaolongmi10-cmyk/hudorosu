import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';

export default function PrivacyPolicyScreen({ onBack }: { onBack: () => void }) {
    return (
        <View style={styles.container}>
            {/* ヘッダー */}
            <ScreenHeader title="プライバシーポリシー" onBack={onBack} />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.lastUpdated}>最終更新日: 2024年1月1日</Text>

                    <Text style={styles.text}>
                        キッチン日和（以下「本アプリ」といいます）は、ユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
                    </Text>

                    <Text style={styles.title}>1. 個人情報の定義</Text>
                    <Text style={styles.text}>
                        本ポリシーにおいて「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報を指します。
                    </Text>

                    <Text style={styles.title}>2. 個人情報の収集方法</Text>
                    <Text style={styles.text}>
                        本アプリは、ユーザーが利用登録をする際に氏名、メールアドレス、パスワードなどの個人情報をお尋ねすることがあります。また、ユーザーと当社との間でなされた記録の記録や決済に関する情報を、当社の提携先（情報提供元、広告主、広告配信先などを含みます。以下「提携先」といいます。）などから収集することがあります。
                    </Text>

                    <Text style={styles.title}>3. 個人情報を収集・利用する目的</Text>
                    <Text style={styles.text}>
                        本アプリが個人情報を収集・利用する目的は、以下のとおりです。
                    </Text>
                    <View style={styles.listContainer}>
                        <Text style={styles.listItem}>1. 本アプリの提供および運営のため</Text>
                        <Text style={styles.listItem}>2. ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</Text>
                        <Text style={styles.listItem}>3. ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等の案内のメールを送付するため</Text>
                        <Text style={styles.listItem}>4. メンテナンス、重要なお知らせなど必要に応じたご連絡のため</Text>
                        <Text style={styles.listItem}>5. 利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</Text>
                        <Text style={styles.listItem}>6. ユーザーにご自身の登録情報の閲覧・変更・削除・ご利用状況の閲覧を行っていただくため</Text>
                        <Text style={styles.listItem}>7. 上記の利用目的に付随する目的</Text>
                    </View>

                    <Text style={styles.title}>4. 利用目的の変更</Text>
                    <Text style={styles.text}>
                        本アプリは、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。利用目的の変更を行った場合には、変更後の目的について、本アプリ所定の方法により、ユーザーに通知し、または本アプリ上に公表するものとします。
                    </Text>

                    <Text style={styles.title}>5. 個人情報の第三者提供</Text>
                    <Text style={styles.text}>
                        本アプリは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
                    </Text>
                    <View style={styles.listContainer}>
                        <Text style={styles.listItem}>1. 人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</Text>
                        <Text style={styles.listItem}>2. 公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</Text>
                        <Text style={styles.listItem}>3. 国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</Text>
                        <Text style={styles.listItem}>4. 予め次の事項を告知あるいは公表し、かつ当社が個人情報保護委員会に届出をしたとき</Text>
                        <View style={styles.subListContainer}>
                            <Text style={styles.subListItem}>・利用目的に第三者への提供を含むこと</Text>
                            <Text style={styles.subListItem}>・第三者に提供されるデータの項目</Text>
                            <Text style={styles.subListItem}>・第三者への提供の手段または方法</Text>
                            <Text style={styles.subListItem}>・本人の求めに応じて個人情報の第三者への提供を停止すること</Text>
                            <Text style={styles.subListItem}>・本人の求めを受け付ける方法</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>6. 個人情報の開示</Text>
                    <Text style={styles.text}>
                        本アプリは、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
                    </Text>
                    <View style={styles.listContainer}>
                        <Text style={styles.listItem}>1. 本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合</Text>
                        <Text style={styles.listItem}>2. 当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合</Text>
                        <Text style={styles.listItem}>3. その他法令に違反することとなる場合</Text>
                    </View>

                    <Text style={styles.title}>7. 個人情報の訂正および削除</Text>
                    <Text style={styles.text}>
                        ユーザーは、本アプリの保有する自己の個人情報が誤った情報である場合には、当社が定める手続により、当社に対して個人情報の訂正、追加または削除（以下「訂正等」といいます。）を請求することができます。当社は、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。
                    </Text>

                    <Text style={styles.title}>8. 個人情報の利用停止等</Text>
                    <Text style={styles.text}>
                        本アプリは、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。
                    </Text>

                    <Text style={styles.title}>9. プライバシーポリシーの変更</Text>
                    <Text style={styles.text}>
                        本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本アプリに掲載したときから効力を生じるものとします。
                    </Text>

                    <Text style={styles.title}>10. お問い合わせ窓口</Text>
                    <Text style={styles.text}>
                        本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
                    </Text>
                    <View style={styles.contactBox}>
                        <Text style={styles.contactText}>メールアドレス: support@example.com</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAECE9',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 96,
    },
    section: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    lastUpdated: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 24,
        textAlign: 'right',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3A4D3A',
        marginTop: 24,
        marginBottom: 12,
    },
    text: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 24,
        marginBottom: 16,
    },
    listContainer: {
        marginLeft: 16,
        marginBottom: 16,
    },
    listItem: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 24,
        marginBottom: 8,
    },
    subListContainer: {
        marginLeft: 16,
        marginTop: 8,
    },
    subListItem: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 22,
        marginBottom: 4,
    },
    contactBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#f9fafb',
    },
    contactText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 22,
    },
});

