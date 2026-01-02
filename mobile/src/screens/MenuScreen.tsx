import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function MenuScreen({
    onNavigateToProfileEdit,
    onNavigateToSecurity,
    onNavigateToHelpCenter,
}: {
    onNavigateToProfileEdit?: () => void;
    onNavigateToSecurity?: () => void;
    onNavigateToHelpCenter?: () => void;
}) {
    const { logout, user } = useAuth();

    return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
            <Image
                source={{
                uri: user?.avatar_url || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
                }}
                style={styles.profileImage}
            />
            </View>
            <Text style={styles.profileName}>{user?.name || 'ユーザー'}</Text>
            <Text style={styles.profileSubtitle}>
            {user?.email || ''}
            </Text>
        </View>

        <View style={styles.menuList}>
            <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={onNavigateToProfileEdit}
            >
                <Ionicons name="people-outline" size={18} color="#6B8E6B" />
                <Text style={styles.menuItemText}>プロフィール編集</Text>
                <View style={styles.menuItemRight}>
                    <Ionicons name="chevron-forward" size={18} color="#e5e7eb" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={onNavigateToSecurity}
            >
                <Ionicons name="shield-outline" size={18} color="#6B8E6B" />
                <Text style={styles.menuItemText}>セキュリティ</Text>
                <View style={styles.menuItemRight}>
                    <Ionicons name="chevron-forward" size={18} color="#e5e7eb" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={onNavigateToHelpCenter}
            >
                <Ionicons name="help-circle-outline" size={18} color="#6B8E6B" />
                <Text style={styles.menuItemText}>ヘルプセンター</Text>
                <View style={styles.menuItemRight}>
                    <Ionicons name="chevron-forward" size={18} color="#e5e7eb" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
            >
                <Ionicons name="notifications-outline" size={18} color="#6B8E6B" />
                <Text style={styles.menuItemText}>通知設定</Text>
                <View style={styles.menuItemRight}>
                    <View style={styles.menuItemBadge}>
                        <Text style={styles.menuItemBadgeText}>3</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#e5e7eb" />
                </View>
            </TouchableOpacity>
        </View>

        <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
            activeOpacity={0.7}
        >
            <Text style={styles.logoutButtonText}>ログアウト</Text>
        </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingBottom: 96,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 32,
        paddingTop: 24,
    },
    profileImageContainer: {
        width: 96,
        height: 96,
        borderRadius: 36,
        backgroundColor: '#6B8E6B',
        padding: 2,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 34,
    },
    profileName: {
        fontSize: 20,
        fontFamily: 'serif',
        color: '#3A4D3A',
    },
    profileSubtitle: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 4,
        fontStyle: 'italic',
    },
    menuList: {
        paddingHorizontal: 24,
        gap: 8,
    },
    menuItem: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderWidth: 1,
        borderColor: '#f9fafb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 8,
    },
    menuItemText: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    menuItemBadge: {
        backgroundColor: '#fb923c',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    menuItemBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    logoutButton: {
        marginHorizontal: 24,
        marginTop: 24,
        marginBottom: 24,
        paddingVertical: 16,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#fee2e2',
        alignItems: 'center',
    },
    logoutButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#f87171',
    },
});
