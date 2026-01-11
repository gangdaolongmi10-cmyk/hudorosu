import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
    fetchTransactions, 
    fetchTransactionStats,
    deleteTransaction,
    getTodayFoodExpense,
    Transaction,
    TransactionFilters,
    TodayFoodExpense
} from '../services/transactionService';
import AddTransactionScreen from './AddTransactionScreen';
import FlashMessage from '../components/FlashMessage';

interface TransactionScreenProps {
    onNavigateToTransaction?: () => void;
}

const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseInt(amount, 10) : Math.floor(amount);
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
        month: '2-digit',
        day: '2-digit',
    });
};

export default function TransactionScreen({ onNavigateToTransaction }: TransactionScreenProps) {
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState<{ totalIncome: number; totalExpense: number; balance: number } | null>(null);
    const [foodExpense, setFoodExpense] = useState<TodayFoodExpense | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        loadData();
    }, [filterType]);

    const loadData = async () => {
        setLoading(true);
        try {
            const filters: TransactionFilters = {
                type: filterType === 'all' ? undefined : filterType,
            };
            const [transactionsData, statsData, foodExpenseData] = await Promise.all([
                fetchTransactions(filters),
                fetchTransactionStats(),
                getTodayFoodExpense().catch(() => null) // エラーが発生しても続行
            ]);
            setTransactions(transactionsData);
            setStats(statsData);
            setFoodExpense(foodExpenseData);
        } catch (error: any) {
            console.error('Error loading transactions:', error);
            Alert.alert('エラー', '記録の読み込みに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionAdded = () => {
        loadData();
        setFlashMessage({
            message: '記録を登録しました',
            type: 'success',
        });
    };

    const handleTransactionUpdated = () => {
        loadData();
        setFlashMessage({
            message: '記録を更新しました',
            type: 'success',
        });
    };

    const handleDelete = async (id: number) => {
        Alert.alert(
            '削除確認',
            'この記録を削除してもよろしいですか？',
            [
                { text: 'キャンセル', style: 'cancel' },
                {
                    text: '削除',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTransaction(id);
                            loadData();
                            setFlashMessage({
                                message: '記録を削除しました',
                                type: 'success',
                            });
                        } catch (error: any) {
                            Alert.alert('エラー', '削除に失敗しました');
                        }
                    },
                },
            ]
        );
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setShowAddTransaction(true);
    };

    const handleCloseAddScreen = () => {
        setShowAddTransaction(false);
        setEditingTransaction(null);
    };

    return (
        <>
            {/* 統計情報 */}
            {stats && (
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>総入金</Text>
                        <Text style={[styles.statValue, styles.incomeValue]}>
                            {formatCurrency(stats.totalIncome)}
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>総出金</Text>
                        <Text style={[styles.statValue, styles.expenseValue]}>
                            {formatCurrency(stats.totalExpense)}
                        </Text>
                    </View>
                    <View style={[styles.statCard, styles.balanceCard]}>
                        <Text style={styles.statLabel}>残高</Text>
                        <Text style={[styles.statValue, stats.balance >= 0 ? styles.positiveBalance : styles.negativeBalance]}>
                            {formatCurrency(stats.balance)}
                        </Text>
                    </View>
                </View>
            )}

            {/* 今日の食費情報 */}
            {foodExpense && foodExpense.daily_food_budget !== null && foodExpense.daily_food_budget > 0 && (
                <View style={styles.foodBudgetContainer}>
                    <View style={styles.foodBudgetCard}>
                        <View style={styles.foodBudgetHeader}>
                            <Ionicons name="restaurant" size={20} color="#EF4444" />
                            <Text style={styles.foodBudgetTitle}>今日の食費</Text>
                        </View>
                        <View style={styles.foodBudgetContent}>
                            <View style={styles.foodBudgetRow}>
                                <Text style={styles.foodBudgetLabel}>目標:</Text>
                                <Text style={styles.foodBudgetValue}>
                                    {formatCurrency(foodExpense.daily_food_budget)}
                                </Text>
                            </View>
                            <View style={styles.foodBudgetRow}>
                                <Text style={styles.foodBudgetLabel}>使用:</Text>
                                <Text style={styles.foodBudgetValue}>
                                    {formatCurrency(foodExpense.today_expense)}
                                </Text>
                            </View>
                            {foodExpense.remaining !== null && foodExpense.remaining >= 0 ? (
                                <View style={styles.foodBudgetRow}>
                                    <Text style={styles.foodBudgetLabel}>残り:</Text>
                                    <Text style={[styles.foodBudgetValue, styles.foodBudgetRemaining]}>
                                        {formatCurrency(foodExpense.remaining)}
                                    </Text>
                                </View>
                            ) : foodExpense.over_budget > 0 ? (
                                <View style={styles.foodBudgetRow}>
                                    <Text style={styles.foodBudgetLabel}>超過:</Text>
                                    <Text style={[styles.foodBudgetValue, styles.foodBudgetOver]}>
                                        {formatCurrency(foodExpense.over_budget)}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                </View>
            )}

            {/* フィルター */}
            <View style={styles.filterContainer}>
                <View style={styles.filterButtons}>
                    {[
                        { id: 'all' as const, label: 'すべて', icon: 'list-outline' },
                        { id: 'income' as const, label: '入金', icon: 'arrow-down-circle-outline' },
                        { id: 'expense' as const, label: '出金', icon: 'arrow-up-circle-outline' },
                    ].map((type) => (
                        <TouchableOpacity
                            key={type.id}
                            onPress={() => setFilterType(type.id)}
                            style={[
                                styles.filterButton,
                                filterType === type.id && styles.filterButtonActive,
                            ]}
                        >
                            <Ionicons
                                name={type.icon as any}
                                size={14}
                                color={filterType === type.id ? '#6B8E6B' : '#8E9A8E'}
                            />
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    filterType === type.id && styles.filterButtonTextActive,
                                ]}
                            >
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6B8E6B" />
                        <Text style={styles.loadingText}>記録を読み込み中...</Text>
                    </View>
                ) : transactions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="wallet-outline" size={48} color="#d1d5db" />
                        <Text style={styles.emptyText}>記録がありません</Text>
                    </View>
                ) : (
                    <View style={styles.transactionsList}>
                        {transactions.map((transaction) => (
                            <TouchableOpacity
                                key={transaction.id}
                                style={styles.transactionCard}
                                activeOpacity={0.7}
                                onPress={() => handleEdit(transaction)}
                            >
                                <View style={styles.transactionHeader}>
                                    <View style={styles.transactionLeft}>
                                        <View style={[
                                            styles.typeIcon,
                                            transaction.type === 'income' ? styles.incomeIcon : styles.expenseIcon
                                        ]}>
                                            <Ionicons
                                                name={transaction.type === 'income' ? 'arrow-down' : 'arrow-up'}
                                                size={16}
                                                color="#ffffff"
                                            />
                                        </View>
                                        <View style={styles.transactionInfo}>
                                            <Text style={styles.transactionDate}>
                                                {formatDate(transaction.transaction_date)}
                                            </Text>
                                            {transaction.category && (
                                                <View style={styles.categoryBadge}>
                                                    <View
                                                        style={[
                                                            styles.categoryColor,
                                                            { backgroundColor: transaction.category.color }
                                                        ]}
                                                    />
                                                    <Text style={styles.categoryName}>
                                                        {transaction.category.name}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                    <View style={styles.transactionRight}>
                                        <Text style={[
                                            styles.transactionAmount,
                                            transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount
                                        ]}>
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {formatCurrency(transaction.amount)}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => handleDelete(transaction.id)}
                                            style={styles.deleteButton}
                                        >
                                            <Ionicons name="trash-outline" size={16} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {transaction.description && (
                                    <Text style={styles.transactionDescription} numberOfLines={2}>
                                        {transaction.description}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* 追加ボタン */}
            <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.7}
                onPress={() => setShowAddTransaction(true)}
            >
                <Ionicons name="add" size={28} color="#ffffff" />
            </TouchableOpacity>

            <AddTransactionScreen
                visible={showAddTransaction}
                onClose={handleCloseAddScreen}
                onTransactionAdded={handleTransactionAdded}
                onTransactionUpdated={handleTransactionUpdated}
                editingTransaction={editingTransaction}
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
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    balanceCard: {
        borderColor: '#6B8E6B',
        borderWidth: 2,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9ca3af',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    incomeValue: {
        color: '#10b981',
    },
    expenseValue: {
        color: '#ef4444',
    },
    positiveBalance: {
        color: '#6B8E6B',
    },
    negativeBalance: {
        color: '#ef4444',
    },
    foodBudgetContainer: {
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    foodBudgetCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    foodBudgetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    foodBudgetTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    foodBudgetContent: {
        gap: 8,
    },
    foodBudgetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    foodBudgetLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    foodBudgetValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    foodBudgetRemaining: {
        color: '#10b981',
    },
    foodBudgetOver: {
        color: '#ef4444',
    },
    filterContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    filterButtons: {
        backgroundColor: '#EDF1ED',
        borderRadius: 16,
        padding: 6,
        flexDirection: 'row',
        gap: 4,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flexDirection: 'row',
    },
    filterButtonActive: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    filterButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#8E9A8E',
    },
    filterButtonTextActive: {
        color: '#6B8E6B',
    },
    content: {
        flex: 1,
        marginTop: 8,
        paddingBottom: 96,
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
    emptyContainer: {
        padding: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 14,
        color: '#9ca3af',
    },
    transactionsList: {
        paddingHorizontal: 24,
        gap: 12,
    },
    transactionCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    typeIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    incomeIcon: {
        backgroundColor: '#10b981',
    },
    expenseIcon: {
        backgroundColor: '#ef4444',
    },
    transactionInfo: {
        flex: 1,
    },
    transactionDate: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    categoryColor: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    categoryName: {
        fontSize: 10,
        color: '#6b7280',
    },
    transactionRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    incomeAmount: {
        color: '#10b981',
    },
    expenseAmount: {
        color: '#ef4444',
    },
    deleteButton: {
        padding: 4,
    },
    transactionDescription: {
        marginTop: 8,
        fontSize: 12,
        color: '#6b7280',
    },
    addButton: {
        position: 'absolute',
        bottom: 40,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6B8E6B',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});

