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
import { DEFAULT_USER_AVATAR_URL } from '../constants/user';
import ScreenHeader from '../components/ScreenHeader';

interface ProfileScreenProps {
    onBack: () => void;
    onNavigateToProfileEdit: () => void;
    onNavigateToFoodBudget: () => void;
}

export default function ProfileScreen({
    onBack,
    onNavigateToProfileEdit,
    onNavigateToFoodBudget,
}: ProfileScreenProps) {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <ScreenHeader title="プロフィール" onBack={onBack} />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* プロフィール情報セクション */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{
                                uri: user?.avatar_url || DEFAULT_USER_AVATAR_URL,
                            }}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.profileName}>{user?.name || 'ユーザー'}</Text>
                    <Text style={styles.profileEmail}>{user?.email}</Text>
                </View>

                {/* メニューリスト */}
                <View style={styles.menuList}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        activeOpacity={0.7}
                        onPress={onNavigateToProfileEdit}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="person-outline" size={24} color="#6B8E6B" />
                            <Text style={styles.menuItemText}>プロフィール編集</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        activeOpacity={0.7}
                        onPress={onNavigateToFoodBudget}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="restaurant-outline" size={24} color="#6B8E6B" />
                            <Text style={styles.menuItemText}>目標食費設定</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                    </TouchableOpacity>
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
        paddingBottom: 96,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 32,
        paddingHorizontal: 24,
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#6B8E6B',
        padding: 3,
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
        borderRadius: 57,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3A4D3A',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#9ca3af',
    },
    menuList: {
        paddingHorizontal: 24,
        gap: 12,
    },
    menuItem: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#f9fafb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
});

