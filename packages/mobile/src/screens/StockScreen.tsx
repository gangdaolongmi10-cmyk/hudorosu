import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem, getProgress, getStatusColor, getStatusText } from '../types/food';
import AddFoodScreen from './AddFoodScreen';
import { fetchStocks, Stock } from '../services/stockService';
import FlashMessage from '../components/FlashMessage';

const { width } = Dimensions.get('window');

interface StockScreenProps {
    items?: FoodItem[];
    onNavigateToStock?: () => void;
}

// アイコンマッピング（簡易版）
const getFoodIcon = (name: string): string => {
    const iconMap: { [key: string]: string } = {
        'ほうれん草': '🥬',
        '卵': '🥚',
        '鶏もも肉': '🍗',
        '牛乳': '🥛',
        '冷凍うどん': '🍜',
        '豚ひき肉': '🥓',
        '玉ねぎ': '🧅',
        'パスタ': '🍝',
    };
    return iconMap[name] || '🥘';
};

// StockをFoodItemに変換
const convertStockToFoodItem = (stock: Stock): FoodItem => {
    const expiryDate = new Date(stock.expiry_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: 'expired' | 'critical' | 'warning' | 'safe';
    if (daysLeft < 0) {
        status = 'expired';
    } else if (daysLeft <= 1) {
        status = 'critical';
    } else if (daysLeft <= 3) {
        status = 'warning';
    } else {
        status = 'safe';
    }
    
    const totalDays = 30;
    
    return {
        id: stock.id,
        name: stock.food?.name || '不明な食材',
        category: stock.food?.category?.name || 'その他',
        daysLeft: daysLeft,
        totalDays: totalDays,
        quantity: stock.quantity || '1個',
        status: status,
        location: stock.storage_type,
        icon: getFoodIcon(stock.food?.name || ''),
    };
};

export default function StockScreen({ items: propItems, onNavigateToStock }: StockScreenProps) {
    const [storageType, setStorageType] = useState<'refrigerator' | 'freezer' | 'pantry'>('refrigerator');
    const [showAddFood, setShowAddFood] = useState(false);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        loadStocks();
    }, [storageType]);

    const loadStocks = async () => {
        setLoading(true);
        try {
            const data = await fetchStocks(storageType);
            setStocks(data);
        } catch (error: any) {
            console.error('Error loading stocks:', error);
            Alert.alert('エラー', '在庫の読み込みに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const handleFoodAdded = () => {
        // APIを再リクエストして一覧を再描画
        loadStocks();
        // フラッシュメッセージを表示
        setFlashMessage({
            message: '在庫を追加しました',
            type: 'success',
        });
    };

    const items: FoodItem[] = propItems || stocks.map(convertStockToFoodItem);
    const filteredItems = items.filter(item => item.location === storageType);

    return (
        <>
            <View style={styles.storageTypeContainer}>
                <View style={styles.storageTypeButtons}>
                {[
                    { id: 'refrigerator' as const, label: '冷蔵', icon: 'thermometer-outline' },
                    { id: 'freezer' as const, label: '冷凍', icon: 'snow-outline' },
                    { id: 'pantry' as const, label: '常温', icon: 'cube-outline' },
                ].map((type) => (
                    <TouchableOpacity
                        key={type.id}
                        onPress={() => setStorageType(type.id)}
                        style={[
                            styles.storageTypeButton,
                            storageType === type.id && styles.storageTypeButtonActive,
                        ]}
                    >
                    <Ionicons
                        name={type.icon as any}
                        size={14}
                        color={storageType === type.id ? '#6B8E6B' : '#8E9A8E'}
                    />
                    <Text
                        style={[
                            styles.storageTypeButtonText,
                            storageType === type.id && styles.storageTypeButtonTextActive,
                        ]}
                    >
                        {type.label}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.itemsGrid}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#6B8E6B" />
                            <Text style={styles.loadingText}>在庫を読み込み中...</Text>
                        </View>
                    ) : (
                        <>
                            {filteredItems.map((item) => (
                                <TouchableOpacity key={item.id} style={styles.itemCard} activeOpacity={0.7}>
                                    <Text style={styles.itemIcon}>{item.icon}</Text>
                                    <View style={styles.itemContent}>
                                        <Text style={styles.itemName} numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                        <Text style={styles.itemQuantity}>{item.quantity}</Text>
                                        <View style={styles.progressBarContainer}>
                                            <View
                                                style={[
                                                    styles.progressBar,
                                                    { width: `${getProgress(item)}%`, backgroundColor: getStatusColor(item.status) },
                                                ]}
                                            />
                                        </View>
                                        <Text style={[styles.itemStatus, { color: getStatusColor(item.status) }]}>
                                            {getStatusText(item)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={styles.addItemCard}
                                activeOpacity={0.7}
                                onPress={() => setShowAddFood(true)}
                            >
                                <Ionicons name="add" size={32} color="#d1d5db" />
                                <Text style={styles.addItemText}>追加する</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>

            <AddFoodScreen
                visible={showAddFood}
                onClose={() => setShowAddFood(false)}
                onFoodAdded={handleFoodAdded}
                onNavigateToStock={onNavigateToStock}
            />

            {/* フラッシュメッセージ */}
            {flashMessage && (
                <FlashMessage
                    message={flashMessage.message}
                    type={flashMessage.type}
                    visible={true}
                    onHide={() => setFlashMessage(null)}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    storageTypeContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    storageTypeButtons: {
        backgroundColor: '#EDF1ED',
        borderRadius: 16,
        padding: 6,
        flexDirection: 'row',
        gap: 4,
    },
    storageTypeButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    storageTypeButtonActive: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    storageTypeButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#8E9A8E',
    },
    storageTypeButtonTextActive: {
        color: '#6B8E6B',
    },
    content: {
        flex: 1,
        marginTop: 24,
        paddingBottom: 96,
    },
    aiSuggestionCard: {
        marginHorizontal: 24,
        marginBottom: 24,
        padding: 16,
        borderRadius: 32,
        backgroundColor: '#6B8E6B',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    aiSuggestionContent: {
        zIndex: 10,
    },
    aiSuggestionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    aiSuggestionLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
        opacity: 0.9,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    aiSuggestionText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        lineHeight: 20,
    },
    aiSuggestionButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    aiSuggestionButtonText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    aiSuggestionIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
        opacity: 0.2,
        transform: [{ rotate: '12deg' }],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'serif',
        color: '#3A4D3A',
    },
    itemCountBadge: {
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    itemCountText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#6B8E6B',
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 24,
        gap: 16,
    },
    itemCard: {
        width: (width - 64) / 2,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    itemIcon: {
        fontSize: 36,
        marginTop: 4,
        marginBottom: 12,
    },
    itemContent: {
        width: '100%',
        alignItems: 'center',
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 10,
        color: '#9ca3af',
        marginBottom: 8,
    },
    progressBarContainer: {
        width: '100%',
        height: 6,
        backgroundColor: '#f3f4f6',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    itemStatus: {
        fontSize: 9,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    addItemCard: {
        width: (width - 64) / 2,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#e5e7eb',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
    },
    addItemText: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: 'bold',
        color: '#d1d5db',
    },
    loadingContainer: {
        width: '100%',
        padding: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#6B8E6B',
    },
});
