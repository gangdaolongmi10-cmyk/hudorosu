import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDailyFoodBudget, setDailyFoodBudget } from '../services/transactionService';
import FlashMessage from '../components/FlashMessage';

interface FoodBudgetScreenProps {
    visible: boolean;
    onClose: () => void;
}

const formatCurrency = (amount: number | null) => {
    if (amount === null) return '未設定';
    const num = Math.floor(amount);
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

export default function FoodBudgetScreen({
    visible,
    onClose,
}: FoodBudgetScreenProps) {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [budget, setBudget] = useState<string>('');
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const budgetRef = useRef<string>('');

    const loadBudget = useCallback(async () => {
        // ロード開始時のbudgetの値を保存
        const budgetAtStart = budgetRef.current;
        setLoading(true);
        try {
            const data = await getDailyFoodBudget();
            const budgetValue = data.daily_food_budget?.toString() || '';
            // ロード開始時と同じ値の場合のみ設定（ユーザーが入力中でない場合）
            if (budgetRef.current === budgetAtStart) {
                setBudget(budgetValue);
                budgetRef.current = budgetValue;
            }
        } catch (error: any) {
            console.error('Error loading budget:', error);
            Alert.alert('エラー', '目標食費の読み込みに失敗しました');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (visible) {
            // モーダルが開かれたとき、budgetをリセットしてからロード
            setBudget('');
            budgetRef.current = '';
            loadBudget();
        } else {
            // モーダルが閉じられたら状態をリセット
            setBudget('');
            budgetRef.current = '';
        }
    }, [visible, loadBudget]);

    // budgetの変更を追跡（ユーザーが入力した場合）
    const handleBudgetChange = useCallback((text: string) => {
        // 数字のみを許可（小数点を除外）
        const numericText = text.replace(/[^0-9]/g, '');
        setBudget(numericText);
        budgetRef.current = numericText;
    }, []);

    const handleSubmit = async () => {
        const budgetInt = budget.trim() === '' ? null : parseInt(budget.trim(), 10);
        
        if (budgetInt !== null && (isNaN(budgetInt) || budgetInt < 0)) {
            Alert.alert('エラー', '有効な金額を入力してください');
            return;
        }

        setSubmitting(true);
        try {
            console.log('Setting budget:', budgetInt, 'from input:', budget);
            const result = await setDailyFoodBudget(budgetInt);
            console.log('Budget set successfully:', result);
            // 保存成功後、表示を更新
            const savedValue = budgetInt?.toString() || '';
            setBudget(savedValue);
            budgetRef.current = savedValue;
            setFlashMessage({
                message: '目標食費を設定しました',
                type: 'success',
            });
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error: any) {
            console.error('Error setting budget:', error);
            console.error('Error details:', error.response?.data);
            const errorMessage = error.response?.data?.error || error.message || '目標食費の設定に失敗しました';
            Alert.alert('エラー', errorMessage);
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
                        <Text style={styles.headerTitle}>1日の目標食費</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <ScrollView 
                        style={styles.content}
                        contentContainerStyle={styles.contentContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#6B8E6B" />
                            </View>
                        ) : (
                            <>
                                <View style={styles.section}>
                                    <Text style={styles.label}>目標金額（円）</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={budget}
                                        onChangeText={handleBudgetChange}
                                        placeholder="例: 1000"
                                        placeholderTextColor="#9ca3af"
                                        keyboardType="number-pad"
                                        editable={!loading}
                                    />
                                    <Text style={styles.hint}>
                                        空欄にすると目標を解除できます
                                    </Text>
                                </View>

                                <View style={styles.infoSection}>
                                    <Ionicons name="information-circle-outline" size={20} color="#6B8E6B" />
                                    <Text style={styles.infoText}>
                                        設定した目標食費に基づいて、家計簿画面で今日の食費の残り金額や超過金額が表示されます。
                                    </Text>
                                </View>
                            </>
                        )}
                    </ScrollView>

                    {/* フッター */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={submitting}
                            activeOpacity={0.7}
                        >
                            {submitting ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text style={styles.submitButtonText}>保存</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* フラッシュメッセージ */}
            {flashMessage && (
                <FlashMessage
                    message={flashMessage.message}
                    type={flashMessage.type}
                    visible={true}
                    onHide={() => setFlashMessage(null)}
                />
            )}
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
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 24,
    },
    loadingContainer: {
        padding: 48,
        alignItems: 'center',
        justifyContent: 'center',
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
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    hint: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 8,
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: '#EDF1ED',
        padding: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#6B8E6B',
        lineHeight: 18,
    },
    footer: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
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

