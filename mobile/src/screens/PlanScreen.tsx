import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchStocks, Stock } from '../services/stockService';

export default function PlanScreen() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);

    // 今日から今月末までの日付を生成
    const generateDays = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
        const todayDate = today.getDate();

        const days = [];
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

        for (let day = todayDate; day <= lastDay; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const weekday = weekdays[date.getDay()];
            days.push({
                date: date,
                day: day.toString(),
                weekday: weekday,
            });
        }

        return days;
    };

    const days = generateDays();

    // 在庫データを取得
    useEffect(() => {
        loadStocks();
    }, []);

    const loadStocks = async () => {
        try {
            setLoading(true);
            const allStocks = await fetchStocks();
            setStocks(allStocks);
        } catch (error) {
            console.error('在庫データの取得に失敗しました:', error);
        } finally {
            setLoading(false);
        }
    };

    // 選択された日付に一致する在庫を取得
    const getStocksForDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`; // YYYY-MM-DD形式
        
        return stocks.filter(stock => {
            const expiryDate = stock.expiry_date.split('T')[0];
            return expiryDate === dateStr;
        });
    };

    const selectedStocks = getStocksForDate(selectedDate);

    // 日付をフォーマット（YYYY-MM-DD）
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 日付が今日かどうかを判定
    const isToday = (date: Date): boolean => {
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();
        
        return (
            date.getFullYear() === todayYear &&
            date.getMonth() === todayMonth &&
            date.getDate() === todayDate
        );
    };

    return (
        <View style={styles.container}>
            {/* Scrollable Area */}
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Date Selector - Horizontal Scroll */}
                <View style={styles.dateSelectorContainer}>
                    <Text style={styles.monthTitle}>
                        {new Date().getMonth() + 1}月
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.dateSelector}
                        snapToInterval={76}
                        decelerationRate="fast"
                        snapToAlignment="start"
                    >
                        {days.map((dayItem, i) => {
                            const isActive = formatDate(selectedDate) === formatDate(dayItem.date);
                            const isTodayDate = isToday(dayItem.date);
                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => setSelectedDate(dayItem.date)}
                                    style={[
                                        styles.dateButton,
                                        isActive && styles.dateButtonActive,
                                        isTodayDate && !isActive && styles.dateButtonToday,
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.dateWeekday,
                                        isActive && styles.dateWeekdayActive,
                                        isTodayDate && !isActive && styles.dateWeekdayToday,
                                    ]}>
                                        {dayItem.weekday}
                                    </Text>
                                    <Text style={[
                                        styles.dateDay,
                                        isActive && styles.dateDayActive,
                                        isTodayDate && !isActive && styles.dateDayToday,
                                    ]}>
                                        {dayItem.day}
                                    </Text>
                                    {isTodayDate && (
                                        <View style={[
                                            styles.todayIndicator,
                                            isActive && styles.todayIndicatorActive,
                                        ]} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Stock Cards */}
                <View style={styles.stocksContainer}>
                    <View style={styles.stocksHeader}>
                        <Text style={styles.stocksHeaderTitle}>
                            {isToday(selectedDate) ? '今日期限の食材' : '期限の食材'}
                        </Text>
                        <Text style={styles.stocksHeaderCount}>
                            {selectedStocks.length}件
                        </Text>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#6B8E6B" />
                        </View>
                    ) : selectedStocks.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
                            <Text style={styles.emptyText}>
                                この日に期限を迎える食材はありません
                            </Text>
                        </View>
                    ) : (
                        selectedStocks.map((stock) => (
                            <View
                                key={stock.id}
                                style={styles.stockCard}
                            >
                                <View style={styles.stockStatusBar} />

                                <View style={styles.stockEmojiContainer}>
                                    <Ionicons 
                                        name={
                                            stock.storage_type === 'refrigerator' 
                                                ? 'snow-outline' 
                                                : stock.storage_type === 'freezer'
                                                ? 'ice-cream-outline'
                                                : 'cube-outline'
                                        } 
                                        size={24} 
                                        color="#6B8E6B" 
                                    />
                                </View>

                                <View style={styles.stockContent}>
                                    <Text style={styles.stockName}>
                                        {stock.food?.name || '食材名不明'}
                                    </Text>
                                    <View style={styles.stockMeta}>
                                        <View style={styles.stockMetaItem}>
                                            <Ionicons name="time-outline" size={12} color="#9ca3af" />
                                            <Text style={styles.stockMetaText}>
                                                {stock.expiry_date.split('T')[0]}
                                            </Text>
                                        </View>
                                        <View style={[styles.stockMetaItem, { marginLeft: 12 }]}>
                                            <Ionicons 
                                                name={
                                                    stock.storage_type === 'refrigerator' 
                                                        ? 'snow' 
                                                        : stock.storage_type === 'freezer'
                                                        ? 'ice-cream'
                                                        : 'cube'
                                                } 
                                                size={12} 
                                                color="#9ca3af" 
                                            />
                                            <Text style={styles.stockMetaText}>
                                                {stock.storage_type === 'refrigerator' 
                                                    ? '冷蔵' 
                                                    : stock.storage_type === 'freezer'
                                                    ? '冷凍'
                                                    : '常温'}
                                            </Text>
                                        </View>
                                        {stock.quantity && (
                                            <View style={[styles.stockMetaItem, { marginLeft: 12 }]}>
                                                <Ionicons name="scale-outline" size={12} color="#9ca3af" />
                                                <Text style={styles.stockMetaText}>
                                                    {stock.quantity}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    {stock.memo && (
                                        <Text style={styles.stockMemo} numberOfLines={2}>
                                            {stock.memo}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAF8',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    dateSelectorContainer: {
        paddingTop: 20,
        paddingBottom: 24,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3A4D3A',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    dateSelector: {
        paddingHorizontal: 24,
    },
    dateButton: {
        width: 64,
        paddingVertical: 14,
        borderRadius: 18,
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        alignItems: 'center',
        marginRight: 12,
        position: 'relative',
    },
    dateButtonActive: {
        backgroundColor: '#6B8E6B',
        borderColor: '#6B8E6B',
        shadowColor: '#6B8E6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        transform: [{ scale: 1.08 }],
    },
    dateButtonToday: {
        borderColor: '#6B8E6B',
        borderWidth: 2,
    },
    dateWeekday: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9ca3af',
        marginBottom: 6,
    },
    dateWeekdayActive: {
        color: '#f0fdf4',
        fontWeight: '700',
    },
    dateWeekdayToday: {
        color: '#6B8E6B',
        fontWeight: '700',
    },
    dateDay: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4b5563',
    },
    dateDayActive: {
        color: '#ffffff',
    },
    dateDayToday: {
        color: '#6B8E6B',
    },
    todayIndicator: {
        position: 'absolute',
        bottom: 6,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#6B8E6B',
    },
    todayIndicatorActive: {
        backgroundColor: '#f0fdf4',
    },
    stocksContainer: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    stocksHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 4,
    },
    stocksHeaderTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3A4D3A',
        letterSpacing: 0.5,
    },
    stocksHeaderCount: {
        fontSize: 13,
        color: '#6B8E6B',
        fontWeight: '600',
    },
    loadingContainer: {
        paddingVertical: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        paddingVertical: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 16,
        textAlign: 'center',
    },
    stockCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 12,
        overflow: 'hidden',
    },
    stockStatusBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 5,
        backgroundColor: '#6B8E6B',
    },
    stockEmojiContainer: {
        width: 52,
        height: 52,
        backgroundColor: '#f0fdf4',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    stockContent: {
        flex: 1,
    },
    stockName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
    },
    stockMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 6,
    },
    stockMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stockMetaText: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
        marginLeft: 4,
    },
    stockMemo: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 4,
        lineHeight: 16,
    },
});