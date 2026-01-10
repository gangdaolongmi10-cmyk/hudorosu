import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    fetchShoppingList,
    createShoppingListFromRecipe,
    updateShoppingListItem,
    deleteShoppingListItem,
    deletePurchasedItems,
    ShoppingListItem
} from '../services/shoppingListService';
import ScreenHeader from '../components/ScreenHeader';
import FlashMessage from '../components/FlashMessage';

interface ShoppingListScreenProps {
    onBack?: () => void;
}

export default function ShoppingListScreen({ onBack }: ShoppingListScreenProps) {
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [includePurchased, setIncludePurchased] = useState(true);
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        loadShoppingList();
    }, [includePurchased]);

    const loadShoppingList = async () => {
        try {
            setLoading(true);
            const data = await fetchShoppingList(includePurchased);
            setItems(data);
        } catch (error: any) {
            console.error('Failed to load shopping list:', error);
            setFlashMessage({
                message: '買い物リストの読み込みに失敗しました',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePurchased = async (item: ShoppingListItem) => {
        try {
            await updateShoppingListItem(item.id, {
                is_purchased: !item.is_purchased
            });
            loadShoppingList();
            setFlashMessage({
                message: item.is_purchased ? '未購入に変更しました' : '購入済みに変更しました',
                type: 'success'
            });
        } catch (error: any) {
            console.error('Failed to update item:', error);
            Alert.alert('エラー', 'アイテムの更新に失敗しました');
        }
    };

    const handleDelete = async (id: number) => {
        Alert.alert(
            '削除確認',
            'このアイテムを削除してもよろしいですか？',
            [
                { text: 'キャンセル', style: 'cancel' },
                {
                    text: '削除',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteShoppingListItem(id);
                            loadShoppingList();
                            setFlashMessage({
                                message: 'アイテムを削除しました',
                                type: 'success'
                            });
                        } catch (error: any) {
                            Alert.alert('エラー', '削除に失敗しました');
                        }
                    },
                },
            ]
        );
    };

    const handleDeletePurchased = () => {
        Alert.alert(
            '削除確認',
            '購入済みのアイテムをすべて削除してもよろしいですか？',
            [
                { text: 'キャンセル', style: 'cancel' },
                {
                    text: '削除',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePurchasedItems();
                            loadShoppingList();
                            setFlashMessage({
                                message: '購入済みアイテムを削除しました',
                                type: 'success'
                            });
                        } catch (error: any) {
                            Alert.alert('エラー', '削除に失敗しました');
                        }
                    },
                },
            ]
        );
    };

    const formatPrice = (price: number | null | undefined): string => {
        if (price === null || price === undefined) return '';
        return `¥${Math.round(price).toLocaleString()}`;
    };

    const purchasedItems = items.filter(item => item.is_purchased);
    const unpurchasedItems = items.filter(item => !item.is_purchased);
    const totalPrice = unpurchasedItems.reduce((sum, item) => {
        const price = item.food?.price;
        return sum + (price ? parseFloat(price.toString()) : 0);
    }, 0);

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="買い物リスト"
                onBack={onBack}
            />
            <View style={styles.filterContainer}>
                <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>購入済みを表示</Text>
                    <Switch
                        value={includePurchased}
                        onValueChange={setIncludePurchased}
                        trackColor={{ false: '#d1d5db', true: '#6B8E6B' }}
                        thumbColor="#ffffff"
                    />
                </View>
                {includePurchased && purchasedItems.length > 0 && (
                    <TouchableOpacity
                        onPress={handleDeletePurchased}
                        style={styles.deletePurchasedButton}
                    >
                        <Ionicons name="trash-outline" size={16} color="#ef4444" />
                        <Text style={styles.deletePurchasedText}>購入済みを削除</Text>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6B8E6B" />
                    <Text style={styles.loadingText}>読み込み中...</Text>
                </View>
            ) : items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={64} color="#9ca3af" />
                    <Text style={styles.emptyText}>買い物リストが空です</Text>
                    <Text style={styles.emptySubText}>レシピから買い物リストを作成できます</Text>
                </View>
            ) : (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {unpurchasedItems.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>未購入</Text>
                                {totalPrice > 0 && (
                                    <Text style={styles.totalPrice}>合計: {formatPrice(totalPrice)}</Text>
                                )}
                            </View>
                            {unpurchasedItems.map((item) => (
                                <View key={item.id} style={styles.itemCard}>
                                    <TouchableOpacity
                                        style={styles.itemContent}
                                        onPress={() => handleTogglePurchased(item)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.checkbox}>
                                            <Ionicons
                                                name={item.is_purchased ? "checkbox" : "square-outline"}
                                                size={24}
                                                color={item.is_purchased ? "#6B8E6B" : "#9ca3af"}
                                            />
                                        </View>
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemName}>{item.food?.name || '不明な食材'}</Text>
                                            {item.quantity && (
                                                <Text style={styles.itemQuantity}>{item.quantity}</Text>
                                            )}
                                            {item.food?.price && (
                                                <Text style={styles.itemPrice}>{formatPrice(item.food.price)}</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDelete(item.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    {includePurchased && purchasedItems.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>購入済み</Text>
                            {purchasedItems.map((item) => (
                                <View key={item.id} style={[styles.itemCard, styles.purchasedItem]}>
                                    <TouchableOpacity
                                        style={styles.itemContent}
                                        onPress={() => handleTogglePurchased(item)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.checkbox}>
                                            <Ionicons
                                                name="checkbox"
                                                size={24}
                                                color="#6B8E6B"
                                            />
                                        </View>
                                        <View style={styles.itemInfo}>
                                            <Text style={[styles.itemName, styles.purchasedText]}>
                                                {item.food?.name || '不明な食材'}
                                            </Text>
                                            {item.quantity && (
                                                <Text style={[styles.itemQuantity, styles.purchasedText]}>
                                                    {item.quantity}
                                                </Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDelete(item.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}

            {flashMessage && (
                <FlashMessage
                    message={flashMessage.message}
                    type={flashMessage.type}
                    visible={true}
                    onHide={() => setFlashMessage(null)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    filterContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    filterLabel: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500',
    },
    deletePurchasedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
    },
    deletePurchasedText: {
        fontSize: 12,
        color: '#ef4444',
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        padding: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#6B8E6B',
    },
    emptyContainer: {
        flex: 1,
        padding: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#1f2937',
        fontWeight: 'bold',
    },
    emptySubText: {
        marginTop: 8,
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6B8E6B',
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    purchasedItem: {
        opacity: 0.6,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: 4,
    },
    purchasedText: {
        textDecorationLine: 'line-through',
        color: '#9ca3af',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#6B8E6B',
        fontWeight: '500',
    },
    deleteButton: {
        padding: 8,
        marginLeft: 8,
    },
});
