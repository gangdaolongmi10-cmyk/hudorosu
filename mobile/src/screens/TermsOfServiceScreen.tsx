import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TermsOfServiceScreen({ onBack }: { onBack: () => void }) {
    return (
        <View style={styles.container}>
            {/* ヘッダー */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={onBack}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#3A4D3A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>利用規約</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.lastUpdated}>最終更新日: 2024年1月1日</Text>

                    <Text style={styles.title}>第1条（適用）</Text>
                    <Text style={styles.text}>
                        本規約は、キッチン日和（以下「本アプリ」といいます）の利用条件を定めるものです。本アプリを利用するすべてのユーザー（以下「ユーザー」といいます）は、本規約に同意した上で本アプリを利用するものとします。
                    </Text>

                    <Text style={styles.title}>第2条（利用登録）</Text>
                    <Text style={styles.text}>
                        本アプリの利用を希望する方は、本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
                    </Text>

                    <Text style={styles.title}>第3条（ユーザーIDおよびパスワードの管理）</Text>
                    <Text style={styles.text}>
                        ユーザーは、自己の責任において、本アプリのユーザーIDおよびパスワードを適切に管理するものとします。ユーザーIDまたはパスワードが第三者に使用されたことによって生じた損害は、当社に故意または重大な過失がある場合を除き、当社は一切の責任を負いません。
                    </Text>

                    <Text style={styles.title}>第4条（利用料金および支払方法）</Text>
                    <Text style={styles.text}>
                        本アプリの利用は、原則として無料です。ただし、将来的に有料機能を追加する場合があります。その際は、事前に通知いたします。
                    </Text>

                    <Text style={styles.title}>第5条（禁止事項）</Text>
                    <Text style={styles.text}>
                        ユーザーは、本アプリの利用にあたり、以下の行為をしてはなりません。
                    </Text>
                    <View style={styles.listContainer}>
                        <Text style={styles.listItem}>1. 法令または公序良俗に違反する行為</Text>
                        <Text style={styles.listItem}>2. 犯罪行為に関連する行為</Text>
                        <Text style={styles.listItem}>3. 本アプリの内容等、本アプリに含まれる著作権、商標権ほか知的財産権を侵害する行為</Text>
                        <Text style={styles.listItem}>4. 本アプリ、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</Text>
                        <Text style={styles.listItem}>5. 本アプリによって得られた情報を商業的に利用する行為</Text>
                        <Text style={styles.listItem}>6. 当社のサービスの運営を妨害するおそれのある行為</Text>
                        <Text style={styles.listItem}>7. 不正アクセスをし、またはこれを試みる行為</Text>
                        <Text style={styles.listItem}>8. その他、当社が不適切と判断する行為</Text>
                    </View>

                    <Text style={styles.title}>第6条（本アプリの提供の停止等）</Text>
                    <Text style={styles.text}>
                        当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本アプリの全部または一部の提供を停止または中断することができるものとします。
                    </Text>
                    <View style={styles.listContainer}>
                        <Text style={styles.listItem}>1. 本アプリにかかるコンピュータシステムの保守点検または更新を行う場合</Text>
                        <Text style={styles.listItem}>2. 地震、落雷、火災、停電または天災などの不可抗力により、本アプリの提供が困難となった場合</Text>
                        <Text style={styles.listItem}>3. コンピュータまたは通信回線等が事故により停止した場合</Text>
                        <Text style={styles.listItem}>4. その他、当社が本アプリの提供が困難と判断した場合</Text>
                    </View>

                    <Text style={styles.title}>第7条（保証の否認および免責）</Text>
                    <Text style={styles.text}>
                        当社は、本アプリに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                    </Text>

                    <Text style={styles.title}>第8条（サービス内容の変更等）</Text>
                    <Text style={styles.text}>
                        当社は、ユーザーへの事前の告知をもって、本アプリの内容を変更、追加または廃止することがあります。
                    </Text>

                    <Text style={styles.title}>第9条（利用規約の変更）</Text>
                    <Text style={styles.text}>
                        当社は以下の場合には、ユーザーの個別の同意なく、本規約を変更することができるものとします。
                    </Text>
                    <View style={styles.listContainer}>
                        <Text style={styles.listItem}>1. 本規約の変更がユーザーの一般の利益に適合するとき</Text>
                        <Text style={styles.listItem}>2. 本規約の変更が本アプリの利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき</Text>
                    </View>

                    <Text style={styles.title}>第10条（個人情報の取扱い）</Text>
                    <Text style={styles.text}>
                        当社は、本アプリの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
                    </Text>

                    <Text style={styles.title}>第11条（通知または連絡）</Text>
                    <Text style={styles.text}>
                        ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
                    </Text>

                    <Text style={styles.title}>第12条（権利義務の譲渡の禁止）</Text>
                    <Text style={styles.text}>
                        ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
                    </Text>

                    <Text style={styles.title}>第13条（準拠法・裁判管轄）</Text>
                    <Text style={styles.text}>
                        本規約の解釈にあたっては、日本法を準拠法とします。本アプリに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
                    </Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3A4D3A',
    },
    headerPlaceholder: {
        width: 40,
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
});

