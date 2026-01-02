import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function SecurityScreen({ onBack }: { onBack: () => void }) {
    const { user } = useAuth();

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
                <Text style={styles.headerTitle}>セキュリティ</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* アカウント情報セクション */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>アカウント情報</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Ionicons name="mail-outline" size={20} color="#6B8E6B" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>メールアドレス</Text>
                                <Text style={styles.infoValue}>{user?.email || '-'}</Text>
                            </View>
                        </View>
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
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f9fafb',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
});

