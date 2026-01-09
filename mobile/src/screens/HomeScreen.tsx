import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Platform,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StockScreen from './StockScreen';
import RecipeScreen from './RecipeScreen';
import PlanScreen from './PlanScreen';
import TransactionScreen from './TransactionScreen';
import MenuScreen from './MenuScreen';
import ProfileScreen from './ProfileScreen';
import ProfileEditScreen from './ProfileEditScreen';
import SecurityScreen from './SecurityScreen';
import HelpCenterScreen from './HelpCenterScreen';
import TermsOfServiceScreen from './TermsOfServiceScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import FoodBudgetScreen from './FoodBudgetScreen';
import RecipeDetailScreen from './RecipeDetailScreen';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_USER_AVATAR_URL } from '../constants/user';

export default function HomeScreen() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('stock');
    const [showProfile, setShowProfile] = useState(false);
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false);
    const [showHelpCenter, setShowHelpCenter] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showFoodBudget, setShowFoodBudget] = useState(false);
    const [showRecipeDetail, setShowRecipeDetail] = useState(false);
    const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

    // すべてのモーダル/画面を閉じる関数
    const closeAllModals = () => {
        setShowProfile(false);
        setShowProfileEdit(false);
        setShowSecurity(false);
        setShowHelpCenter(false);
        setShowTerms(false);
        setShowPrivacy(false);
        setShowFoodBudget(false);
        setShowRecipeDetail(false);
        setSelectedRecipeId(null);
    };

    // タブを切り替える関数
    const handleTabChange = (tab: string) => {
        closeAllModals();
        setActiveTab(tab);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#EAECE9" translucent={true} />

            {/* ヘッダー背景装飾 */}
            <View style={styles.headerBackground} />

            {/* ナビゲーションバー */}
            <ScreenHeader 
                title="キッチン日和" 
                titleStyle={styles.homeHeaderTitle}
                rightComponent={
                    <TouchableOpacity
                        onPress={() => setShowProfile(true)}
                        style={styles.profileButton}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={{
                                uri: user?.avatar_url || DEFAULT_USER_AVATAR_URL,
                            }}
                            style={styles.profileIcon}
                        />
                    </TouchableOpacity>
                }
            />

            {/* メインコンテンツ */}
            <View style={styles.mainContent}>
                {showProfile ? (
                    <ProfileScreen
                        onBack={() => setShowProfile(false)}
                        onNavigateToProfileEdit={() => {
                            setShowProfile(false);
                            setShowProfileEdit(true);
                        }}
                        onNavigateToFoodBudget={() => {
                            setShowProfile(false);
                            setShowFoodBudget(true);
                        }}
                    />
                ) : showProfileEdit ? (
                    <ProfileEditScreen onBack={() => setShowProfileEdit(false)} />
                ) : showSecurity ? (
                    <SecurityScreen onBack={() => setShowSecurity(false)} />
                ) : showHelpCenter ? (
                    <HelpCenterScreen
                        onBack={() => setShowHelpCenter(false)}
                        onNavigateToTerms={() => setShowTerms(true)}
                        onNavigateToPrivacy={() => setShowPrivacy(true)}
                    />
                ) : showTerms ? (
                    <TermsOfServiceScreen onBack={() => setShowTerms(false)} />
                ) : showPrivacy ? (
                    <PrivacyPolicyScreen onBack={() => setShowPrivacy(false)} />
                ) : showRecipeDetail && selectedRecipeId ? (
                    <RecipeDetailScreen
                        recipeId={selectedRecipeId}
                        onBack={() => {
                            setShowRecipeDetail(false);
                            setSelectedRecipeId(null);
                        }}
                    />
                ) : (
                    <>
                        {activeTab === 'stock' && <StockScreen onNavigateToStock={() => setActiveTab('stock')} />}
                        {activeTab === 'recipe' && (
                            <RecipeScreen
                                onNavigateToRecipeDetail={(recipeId) => {
                                    setSelectedRecipeId(recipeId);
                                    setShowRecipeDetail(true);
                                }}
                            />
                        )}
                        {activeTab === 'calendar' && <PlanScreen />}
                        {activeTab === 'transaction' && <TransactionScreen onNavigateToTransaction={() => setActiveTab('transaction')} />}
                        {activeTab === 'settings' && (
                            <MenuScreen
                                onNavigateToProfileEdit={() => setShowProfile(true)}
                                onNavigateToSecurity={() => setShowSecurity(true)}
                                onNavigateToHelpCenter={() => setShowHelpCenter(true)}
                                onNavigateToFoodBudget={() => setShowFoodBudget(true)}
                            />
                        )}
                    </>
                )}
            </View>

            {/* 目標食費設定画面（Modal） */}
            <FoodBudgetScreen visible={showFoodBudget} onClose={() => setShowFoodBudget(false)} />

            {/* タブバー */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    onPress={() => handleTabChange('stock')}
                    style={styles.tabButton}
                    activeOpacity={0.7}
                >
                    <View
                        style={[
                            styles.tabIconContainer,
                            activeTab === 'stock' && styles.tabIconContainerActive,
                        ]}
                    >
                        <Ionicons
                            name="grid"
                            size={22}
                            color={activeTab === 'stock' ? '#6B8E6B' : '#d1d5db'}
                        />
                    </View>
                    <Text
                        style={[
                            styles.tabLabel,
                            activeTab === 'stock' && styles.tabLabelActive,
                        ]}
                    >
                        在庫
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={() => handleTabChange('recipe')}
                style={styles.tabButton}
                activeOpacity={0.7}
                >
                <View
                    style={[
                        styles.tabIconContainer,
                        activeTab === 'recipe' && styles.tabIconContainerActive,
                    ]}
                >
                    <Ionicons
                        name="star"
                        size={22}
                        color={activeTab === 'recipe' ? '#6B8E6B' : '#d1d5db'}
                    />
                </View>
                <Text
                    style={[
                        styles.tabLabel,
                        activeTab === 'recipe' && styles.tabLabelActive,
                    ]}
                >
                    レシピ
                </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleTabChange('calendar')}
                    style={styles.tabButton}
                    activeOpacity={0.7}
                >
                    <View
                        style={[
                            styles.tabIconContainer,
                            activeTab === 'calendar' && styles.tabIconContainerActive,
                        ]}
                    >
                        <Ionicons
                            name="calendar"
                            size={22}
                            color={activeTab === 'calendar' ? '#6B8E6B' : '#d1d5db'}
                        />
                    </View>
                    <Text
                        style={[
                            styles.tabLabel,
                            activeTab === 'calendar' && styles.tabLabelActive,
                        ]}
                    >
                        カレンダー
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleTabChange('transaction')}
                    style={styles.tabButton}
                    activeOpacity={0.7}
                >
                    <View
                        style={[
                            styles.tabIconContainer,
                            activeTab === 'transaction' && styles.tabIconContainerActive,
                        ]}
                    >
                        <Ionicons
                            name="wallet"
                            size={22}
                            color={activeTab === 'transaction' ? '#6B8E6B' : '#d1d5db'}
                        />
                    </View>
                    <Text
                        style={[
                            styles.tabLabel,
                            activeTab === 'transaction' && styles.tabLabelActive,
                        ]}
                    >
                        家計簿
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleTabChange('settings')}
                    style={styles.tabButton}
                    activeOpacity={0.7}
                >
                    <View
                        style={[
                            styles.tabIconContainer,
                            activeTab === 'settings' && styles.tabIconContainerActive,
                        ]}
                    >
                        <Ionicons
                            name="settings"
                            size={22}
                            color={activeTab === 'settings' ? '#6B8E6B' : '#d1d5db'}
                        />
                    </View>
                    <Text
                        style={[
                            styles.tabLabel,
                            activeTab === 'settings' && styles.tabLabelActive,
                        ]}
                    >
                        設定
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ホームインジケーター（iOS用） */}
            {Platform.OS === 'ios' && (
                <View style={styles.homeIndicator} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAECE9',
        paddingTop: 8
    },
    statusBar: {
        height: 44,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: Platform.OS === 'ios' ? 0 : 8,
    },
    statusBarTime: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    statusBarIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusBarSignal: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#000',
    },
    statusBarBattery: {
        width: 16,
        height: 10,
        backgroundColor: '#000',
        borderRadius: 2,
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 192,
        backgroundColor: '#6B8E6B',
        opacity: 0.1,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        zIndex: 0,
    },
    mainContent: {
        flex: 1,
        zIndex: 10,
    },
    tabBar: {
        height: 96,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderTopWidth: 1,
        borderTopColor: '#f9fafb',
        paddingHorizontal: 32,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 20,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    tabIconContainer: {
        padding: 8,
        borderRadius: 12,
    },
    tabIconContainerActive: {
        backgroundColor: '#f0fdf4',
    },
    tabLabel: {
        fontSize: 9,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: '#d1d5db',
    },
    tabLabelActive: {
        color: '#6B8E6B',
    },
    homeIndicator: {
        position: 'absolute',
        bottom: 8,
        left: '50%',
        marginLeft: -50,
        width: 100,
        height: 6,
        backgroundColor: '#e5e7eb',
        borderRadius: 3,
    },
    homeHeaderTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#6B8E6B',
    },
    profileIcon: {
        width: '100%',
        height: '100%',
    },
});
