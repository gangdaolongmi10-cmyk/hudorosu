import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpCenterScreen({
    onBack,
    onNavigateToTerms,
    onNavigateToPrivacy,
}: {
    onBack: () => void;
    onNavigateToTerms?: () => void;
    onNavigateToPrivacy?: () => void;
}) {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const faqs = [
        {
            id: 1,
            question: 'アプリの使い方を教えてください',
            answer: 'キッチン日和は、食材の在庫管理とレシピ提案を行うアプリです。\n\n1. Stock: 在庫にある食材を管理します\n2. Recipe: レシピを検索・閲覧します\n3. Plan: 食事計画を立てます\n4. Menu: 設定やプロフィールを管理します',
        },
        {
            id: 2,
            question: '食材を追加するには？',
            answer: 'Stock画面の「+」ボタンをタップして、食材名、カテゴリー、期限日などを入力してください。保存すると在庫に追加されます。',
        },
        {
            id: 3,
            question: 'パスワードを忘れてしまいました',
            answer: '現在、パスワードリセット機能は実装されていません。管理者にお問い合わせください。',
        },
        {
            id: 4,
            question: 'アカウントを削除したい',
            answer: 'アカウントの削除をご希望の場合は、管理者にお問い合わせください。',
        },
        {
            id: 5,
            question: 'データはどこに保存されますか？',
            answer: 'すべてのデータは安全なサーバーに保存され、暗号化されています。プライバシーを保護するため、適切なセキュリティ対策を講じています。',
        },
        {
            id: 6,
            question: 'オフラインで使用できますか？',
            answer: '現在、オフライン機能は実装されていません。インターネット接続が必要です。',
        },
    ];

    const toggleFaq = (id: number) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const handleContact = () => {
        const email = 'support@example.com';
        const subject = 'キッチン日和 お問い合わせ';
        const body = 'お問い合わせ内容をご記入ください。\n\n';
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        Linking.openURL(url).catch((err) => {
            console.error('メールアプリを開けませんでした:', err);
        });
    };

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
                <Text style={styles.headerTitle}>ヘルプセンター</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* よくある質問セクション */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>よくある質問</Text>
                    <View style={styles.faqContainer}>
                        {faqs.map((faq) => (
                            <View key={faq.id} style={styles.faqCard}>
                                <TouchableOpacity
                                    style={styles.faqHeader}
                                    onPress={() => toggleFaq(faq.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                                    <Ionicons
                                        name={
                                            expandedFaq === faq.id
                                                ? 'chevron-up'
                                                : 'chevron-down'
                                        }
                                        size={20}
                                        color="#6B8E6B"
                                    />
                                </TouchableOpacity>
                                {expandedFaq === faq.id && (
                                    <View style={styles.faqAnswer}>
                                        <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* お問い合わせセクション */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>お問い合わせ</Text>
                    <View style={styles.contactCard}>
                        <Ionicons name="mail-outline" size={32} color="#6B8E6B" />
                        <Text style={styles.contactTitle}>サポートに連絡</Text>
                        <Text style={styles.contactText}>
                            ご不明な点がございましたら、お気軽にお問い合わせください。
                        </Text>
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={handleContact}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="mail" size={18} color="#fff" />
                            <Text style={styles.contactButtonText}>メールで問い合わせる</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* アプリ情報セクション */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>アプリについて</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>アプリ名</Text>
                            <Text style={styles.infoValue}>キッチン日和</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>バージョン</Text>
                            <Text style={styles.infoValue}>1.0.0</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>開発元</Text>
                            <Text style={styles.infoValue}>Hudorosu Team</Text>
                        </View>
                    </View>
                </View>

                {/* 利用規約・プライバシーポリシー */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>その他</Text>
                    <View style={styles.linksContainer}>
                        <TouchableOpacity
                            style={styles.linkCard}
                            activeOpacity={0.7}
                            onPress={onNavigateToTerms}
                        >
                            <Ionicons name="document-text-outline" size={20} color="#6B8E6B" />
                            <Text style={styles.linkText}>利用規約</Text>
                            <Ionicons name="chevron-forward" size={18} color="#e5e7eb" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.linkCard}
                            activeOpacity={0.7}
                            onPress={onNavigateToPrivacy}
                        >
                            <Ionicons name="shield-checkmark-outline" size={20} color="#6B8E6B" />
                            <Text style={styles.linkText}>プライバシーポリシー</Text>
                            <Ionicons name="chevron-forward" size={18} color="#e5e7eb" />
                        </TouchableOpacity>
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
        marginBottom: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3A4D3A',
        marginBottom: 16,
    },
    faqContainer: {
        gap: 12,
    },
    faqCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f9fafb',
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    faqQuestion: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginRight: 12,
    },
    faqAnswer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: '#f9fafb',
    },
    faqAnswerText: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 22,
        marginTop: 12,
    },
    contactCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f9fafb',
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    contactText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#6B8E6B',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f9fafb',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f9fafb',
    },
    infoLabel: {
        fontSize: 14,
        color: '#9ca3af',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    linksContainer: {
        gap: 12,
    },
    linkCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f9fafb',
    },
    linkText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
});

