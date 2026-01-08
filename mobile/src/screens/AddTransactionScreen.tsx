import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Modal,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
    createTransaction, 
    updateTransaction,
    fetchTransactionCategories,
    Transaction,
    TransactionCategory 
} from '../services/transactionService';

interface AddTransactionScreenProps {
    visible: boolean;
    onClose: () => void;
    onTransactionAdded?: () => void;
    onTransactionUpdated?: () => void;
    editingTransaction?: Transaction | null;
}

const getCurrentDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function AddTransactionScreen({
    visible,
    onClose,
    onTransactionAdded,
    onTransactionUpdated,
    editingTransaction,
}: AddTransactionScreenProps) {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [formData, setFormData] = useState({
        type: 'expense' as 'income' | 'expense',
        amount: '',
        category_id: '',
        description: '',
        transaction_date: getCurrentDateString(),
    });

    useEffect(() => {
        if (visible) {
            loadCategories();
            if (editingTransaction) {
                setFormData({
                    type: editingTransaction.type,
                    amount: editingTransaction.amount,
                    category_id: editingTransaction.category_id?.toString() || '',
                    description: editingTransaction.description || '',
                    transaction_date: editingTransaction.transaction_date,
                });
            } else {
                setFormData({
                    type: 'expense',
                    amount: '',
                    category_id: '',
                    description: '',
                    transaction_date: getCurrentDateString(),
                });
            }
        }
    }, [visible, editingTransaction]);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await fetchTransactionCategories();
            setCategories(data);
        } catch (error: any) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        const amountInt = parseInt(formData.amount, 10);
        if (!formData.amount || isNaN(amountInt) || amountInt <= 0) {
            Alert.alert('エラー', '有効な金額を入力してください');
            return;
        }

        if (!formData.transaction_date) {
            Alert.alert('エラー', '記録日を入力してください');
            return;
        }

        setSubmitting(true);
        try {
            const submitData = {
                type: formData.type,
                amount: amountInt,
                category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
                description: formData.description.trim() || null,
                transaction_date: formData.transaction_date,
            };

            if (editingTransaction) {
                await updateTransaction(editingTransaction.id, submitData);
                onTransactionUpdated?.();
            } else {
                await createTransaction(submitData);
                onTransactionAdded?.();
            }
            onClose();
        } catch (error: any) {
            console.error('Error submitting transaction:', error);
            Alert.alert('エラー', editingTransaction ? '記録の更新に失敗しました' : '記録の作成に失敗しました');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* ヘッダー */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#1f2937" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>
                            {editingTransaction ? '記録を編集' : '記録を追加'}
                        </Text>
                        <View style={styles.placeholder} />
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* タイプ選択 */}
                        <View style={styles.section}>
                            <Text style={styles.label}>タイプ</Text>
                            <View style={styles.typeButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.typeButton,
                                        formData.type === 'income' && styles.typeButtonActive,
                                        formData.type === 'income' && styles.incomeButton,
                                    ]}
                                    onPress={() => setFormData({ ...formData, type: 'income' })}
                                >
                                    <Ionicons
                                        name="arrow-down-circle"
                                        size={20}
                                        color={formData.type === 'income' ? '#ffffff' : '#10b981'}
                                    />
                                    <Text
                                        style={[
                                            styles.typeButtonText,
                                            formData.type === 'income' && styles.typeButtonTextActive,
                                        ]}
                                    >
                                        入金
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.typeButton,
                                        formData.type === 'expense' && styles.typeButtonActive,
                                        formData.type === 'expense' && styles.expenseButton,
                                    ]}
                                    onPress={() => setFormData({ ...formData, type: 'expense' })}
                                >
                                    <Ionicons
                                        name="arrow-up-circle"
                                        size={20}
                                        color={formData.type === 'expense' ? '#ffffff' : '#ef4444'}
                                    />
                                    <Text
                                        style={[
                                            styles.typeButtonText,
                                            formData.type === 'expense' && styles.typeButtonTextActive,
                                        ]}
                                    >
                                        出金
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 金額 */}
                        <View style={styles.section}>
                            <Text style={styles.label}>金額</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.amount}
                                onChangeText={(text) => {
                                    // 数字のみを許可（小数点を除外）
                                    const numericText = text.replace(/[^0-9]/g, '');
                                    setFormData({ ...formData, amount: numericText });
                                }}
                                placeholder="0"
                                keyboardType="number-pad"
                            />
                        </View>

                        {/* カテゴリ */}
                        <View style={styles.section}>
                            <Text style={styles.label}>カテゴリ（オプション）</Text>
                            {loading ? (
                                <ActivityIndicator size="small" color="#6B8E6B" />
                            ) : (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryChip,
                                            !formData.category_id && styles.categoryChipActive,
                                        ]}
                                        onPress={() => setFormData({ ...formData, category_id: '' })}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryChipText,
                                                !formData.category_id && styles.categoryChipTextActive,
                                            ]}
                                        >
                                            未分類
                                        </Text>
                                    </TouchableOpacity>
                                    {categories.map((category) => (
                                        <TouchableOpacity
                                            key={category.id}
                                            style={[
                                                styles.categoryChip,
                                                formData.category_id === category.id.toString() && styles.categoryChipActive,
                                            ]}
                                            onPress={() => setFormData({ ...formData, category_id: category.id.toString() })}
                                        >
                                            <View
                                                style={[
                                                    styles.categoryColorDot,
                                                    { backgroundColor: category.color }
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    styles.categoryChipText,
                                                    formData.category_id === category.id.toString() && styles.categoryChipTextActive,
                                                ]}
                                            >
                                                {category.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        {/* 記録日 */}
                        <View style={styles.section}>
                            <Text style={styles.label}>記録日</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.transaction_date}
                                onChangeText={(text) => setFormData({ ...formData, transaction_date: text })}
                                placeholder="YYYY-MM-DD"
                            />
                        </View>

                        {/* 説明 */}
                        <View style={styles.section}>
                            <Text style={styles.label}>説明（オプション）</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                                placeholder="記録の説明を入力してください"
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </ScrollView>

                    {/* フッター */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    {editingTransaction ? '更新' : '登録'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    placeholder: {
        width: 32,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8,
    },
    typeButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e5e7eb',
    },
    typeButtonActive: {
        borderWidth: 2,
    },
    incomeButton: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    expenseButton: {
        backgroundColor: '#ef4444',
        borderColor: '#ef4444',
    },
    typeButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6b7280',
    },
    typeButtonTextActive: {
        color: '#ffffff',
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    categoryScroll: {
        marginTop: 8,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        marginRight: 8,
    },
    categoryChipActive: {
        backgroundColor: '#6B8E6B',
        borderColor: '#6B8E6B',
    },
    categoryColorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    categoryChipText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6b7280',
    },
    categoryChipTextActive: {
        color: '#ffffff',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    submitButton: {
        backgroundColor: '#6B8E6B',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

