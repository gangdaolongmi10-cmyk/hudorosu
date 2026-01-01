import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem, getProgress, getStatusColor, getStatusText } from '../types/food';

const { width } = Dimensions.get('window');

interface StockScreenProps {
    items: FoodItem[];
}

export default function StockScreen({ items }: StockScreenProps) {
    const [storageType, setStorageType] = useState<'refrigerator' | 'freezer' | 'pantry'>('refrigerator');

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
            <View style={styles.aiSuggestionCard}>
            <View style={styles.aiSuggestionContent}>
                <View style={styles.aiSuggestionHeader}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.aiSuggestionLabel}>AI Suggestion</Text>
                </View>
                <Text style={styles.aiSuggestionText}>
                期限の近い「ほうれん草」で{'\n'}お浸しはいかがですか？
                </Text>
                <TouchableOpacity style={styles.aiSuggestionButton}>
                <Text style={styles.aiSuggestionButtonText}>レシピを見る</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.aiSuggestionIcon}>
                <Ionicons name="restaurant-outline" size={100} color="#ffffff" />
            </View>
            </View>

            <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
                {storageType === 'refrigerator'
                ? '冷蔵庫のなか'
                : storageType === 'freezer'
                ? '冷凍庫のなか'
                : 'ストック'}
            </Text>
            <View style={styles.itemCountBadge}>
                <Text style={styles.itemCountText}>{filteredItems.length} ITEMS</Text>
            </View>
            </View>

            <View style={styles.itemsGrid}>
            {filteredItems.map((item) => (
                <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                activeOpacity={0.7}
                >
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
                    <Text
                    style={[
                        styles.itemStatus,
                        { color: getStatusColor(item.status) },
                    ]}
                    >
                    {getStatusText(item)}
                    </Text>
                </View>
                </TouchableOpacity>
            ))}
            <TouchableOpacity
                style={styles.addItemCard}
                activeOpacity={0.7}
            >
                <Ionicons name="add" size={32} color="#d1d5db" />
                <Text style={styles.addItemText}>追加する</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
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
});
