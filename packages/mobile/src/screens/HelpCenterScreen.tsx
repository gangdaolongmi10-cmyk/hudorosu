import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Linking,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { fetchFaqs, Faq } from '../services/faqService';

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
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFaqs = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchFaqs();
                setFaqs(data);
            } catch (err: any) {
                console.error('FAQ取得エラー:', err);
                setError('FAQの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadFaqs();
    }, []);

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
            <ScreenHeader title="ヘルプセンター" onBack={onBack} />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* よくある質問セクション */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>よくある質問</Text>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#6B8E6B" />
                            <Text style={styles.loadingText}>読み込み中...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle-outline" size={32} color="#ef4444" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : faqs.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>FAQが登録されていません</Text>
                        </View>
                    ) : (
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
                    )}
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
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6b7280',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    errorText: {
        marginTop: 12,
        fontSize: 14,
        color: '#ef4444',
        textAlign: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 14,
        color: '#6b7280',
    },
});

