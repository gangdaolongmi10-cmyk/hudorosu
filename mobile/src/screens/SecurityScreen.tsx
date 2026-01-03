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
import ScreenHeader from '../components/ScreenHeader';

export default function SecurityScreen({ onBack }: { onBack: () => void }) {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            {/* ヘッダー */}
            <ScreenHeader title="セキュリティ" onBack={onBack} />

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

