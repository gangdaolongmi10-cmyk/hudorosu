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
    Dimensions,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchMasterFoods, fetchCategories, createUserFood, MasterFood, Category } from '../services/foodService';
import { createStock } from '../services/stockService';

const { width } = Dimensions.get('window');

interface AddFoodScreenProps {
    visible: boolean;
    onClose: () => void;
    onFoodAdded?: () => void;
    onNavigateToStock?: () => void;
}

type Mode = 'select' | 'create';

export default function AddFoodScreen({ visible, onClose, onFoodAdded, onNavigateToStock }: AddFoodScreenProps) {
    const [mode, setMode] = useState<Mode>('select');
    const [categories, setCategories] = useState<Category[]>([]);
    const [masterFoods, setMasterFoods] = useState<MasterFood[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [filteredFoods, setFilteredFoods] = useState<MasterFood[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedFood, setSelectedFood] = useState<MasterFood | null>(null);
    const [stockFormData, setStockFormData] = useState({
        date_type: 'expiry' as 'best_before' | 'expiry',
        expiry_date: '',
        storage_type: 'refrigerator' as 'refrigerator' | 'freezer' | 'pantry',
        quantity: '',
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        category_id: 0,
        best_before_date: '',
        expiry_date: '',
        memo: '',
        storage_type: 'refrigerator' as 'refrigerator' | 'freezer' | 'pantry',
        quantity: '',
        date_type: 'expiry' as 'best_before' | 'expiry',
    });
    const [showCreateDatePicker, setShowCreateDatePicker] = useState(false);
    const [selectedCreateDate, setSelectedCreateDate] = useState<{ year: number; month: number; day: number } | null>(null);

    // 日付選択用のヘルパー関数
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };

    const getCurrentDate = () => {
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
        };
    };

    const formatDateString = (date: { year: number; month: number; day: number }) => {
        const monthStr = String(date.month).padStart(2, '0');
        const dayStr = String(date.day).padStart(2, '0');
        return `${date.year}-${monthStr}-${dayStr}`;
    };

    const parseDateString = (dateStr: string) => {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        if (parts.length !== 3) return null;
        return {
            year: parseInt(parts[0], 10),
            month: parseInt(parts[1], 10),
            day: parseInt(parts[2], 10),
        };
    };

    const handleDatePickerOpen = (isCreate: boolean) => {
        const currentDate = isCreate 
            ? (formData.expiry_date ? parseDateString(formData.expiry_date) : getCurrentDate())
            : (stockFormData.expiry_date ? parseDateString(stockFormData.expiry_date) : getCurrentDate());
        
        if (isCreate) {
            setSelectedCreateDate(currentDate || getCurrentDate());
            setShowCreateDatePicker(true);
        } else {
            setSelectedDate(currentDate || getCurrentDate());
            setShowDatePicker(true);
        }
    };

    const handleDatePickerConfirm = (isCreate: boolean) => {
        if (isCreate && selectedCreateDate) {
            const dateStr = formatDateString(selectedCreateDate);
            setFormData({ ...formData, expiry_date: dateStr });
            setShowCreateDatePicker(false);
        } else if (!isCreate && selectedDate) {
            const dateStr = formatDateString(selectedDate);
            setStockFormData({ ...stockFormData, expiry_date: dateStr });
            setShowDatePicker(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            filterFoodsByCategory(selectedCategory);
        } else {
            setFilteredFoods(masterFoods);
        }
    }, [selectedCategory, masterFoods]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            if (selectedCategory) {
                filterFoodsByCategory(selectedCategory);
            } else {
                setFilteredFoods(masterFoods);
            }
        } else {
            const filtered = masterFoods.filter(food =>
                food.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredFoods(filtered);
        }
    }, [searchQuery]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [categoriesData, foodsData] = await Promise.all([
                fetchCategories(),
                fetchMasterFoods(),
            ]);
            setCategories(categoriesData);
            setMasterFoods(foodsData);
            setFilteredFoods(foodsData);
        } catch (error: any) {
            console.error('Error loading data:', error);
            Alert.alert('エラー', 'データの読み込みに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const filterFoodsByCategory = (categoryId: number) => {
        const filtered = masterFoods.filter(food => food.category_id === categoryId);
        setFilteredFoods(filtered);
    };

    const handleSelectFood = (food: MasterFood) => {
        setSelectedFood(food);
        // マスタ食材の期限日があれば初期値として設定
        const initialDate = food.expiry_date || food.best_before_date || '';
        setStockFormData({
            date_type: food.expiry_date ? 'expiry' : 'best_before',
            expiry_date: initialDate,
            storage_type: 'refrigerator',
            quantity: '',
        });
    };

    const handleCancelStockForm = () => {
        setSelectedFood(null);
        setStockFormData({
            date_type: 'expiry',
            expiry_date: '',
            storage_type: 'refrigerator',
            quantity: '',
        });
        setShowDatePicker(false);
    };

    const handleConfirmStockForm = async () => {
        if (!selectedFood) return;

        if (!stockFormData.expiry_date.trim()) {
            Alert.alert('エラー', '期限日を入力してください');
            return;
        }

        await addFoodToStock(
            selectedFood,
            stockFormData.expiry_date,
            stockFormData.storage_type,
            stockFormData.quantity
        );
    };

    const addFoodToStock = async (
        food: MasterFood,
        expiryDate: string,
        storageType: 'refrigerator' | 'freezer' | 'pantry',
        quantity?: string | null
    ) => {
        setSubmitting(true);
        try {
            console.log('Adding food to stock:', food.name);
            
            // マスタ食材の場合は、foodsテーブルに登録せず、直接stocksテーブルに追加
            // マスタ食材のIDをそのまま使用
            const foodId = food.id;

            // stocksテーブルに在庫を追加
            await createStock({
                food_id: foodId,
                expiry_date: expiryDate,
                storage_type: storageType,
                quantity: quantity || null,
                memo: null,
            });

            console.log('Stock added successfully');
            Alert.alert('成功', '食材を在庫に追加しました', [
                {
                    text: 'OK',
                    onPress: () => {
                        if (onFoodAdded) {
                            onFoodAdded();
                        }
                        if (onNavigateToStock) {
                            onNavigateToStock();
                        }
                        onClose();
                    },
                },
            ]);
        } catch (error: any) {
            console.error('Error adding food to stock:', error);
            const errorMessage = error.response?.data?.error || error.message || '食材の追加に失敗しました';
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            Alert.alert('エラー', errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateFood = async () => {
        if (!formData.name.trim()) {
            Alert.alert('エラー', '食材名を入力してください');
            return;
        }

        if (!formData.category_id) {
            Alert.alert('エラー', 'カテゴリーを選択してください');
            return;
        }

        if (!formData.expiry_date?.trim()) {
            Alert.alert('エラー', '期限日を入力してください');
            return;
        }

        setSubmitting(true);
        try {
            console.log('Creating food in database:', formData.name);
            // date_typeに基づいてbest_before_dateまたはexpiry_dateを設定
            const foodData = {
                name: formData.name.trim(),
                category_id: formData.category_id,
                best_before_date: formData.date_type === 'best_before' ? formData.expiry_date.trim() : null,
                expiry_date: formData.date_type === 'expiry' ? formData.expiry_date.trim() : null,
                memo: formData.memo.trim() || null,
            };
            console.log('Food data to send:', foodData);

            // まず、foodsテーブルにユーザー固有の食材を作成
            const result = await createUserFood(foodData);
            console.log('Food created successfully:', result);

            // stocksテーブルに在庫を追加
            await createStock({
                food_id: result.id,
                expiry_date: formData.expiry_date.trim(),
                storage_type: formData.storage_type,
                quantity: formData.quantity?.trim() || null,
                memo: formData.memo.trim() || null,
            });

            console.log('Stock added successfully');
            Alert.alert('成功', '食材を在庫に追加しました', [
                {
                    text: 'OK',
                    onPress: () => {
                        if (onFoodAdded) {
                            onFoodAdded();
                        }
                        if (onNavigateToStock) {
                            onNavigateToStock();
                        }
                        onClose();
                    },
                },
            ]);
        } catch (error: any) {
            console.error('Error creating food:', error);
            const errorMessage = error.response?.data?.error || error.message || '食材の作成に失敗しました';
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            Alert.alert('エラー', errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* ヘッダー */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#3A4D3A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>食材を追加</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* モード選択 */}
                <View style={styles.modeSelector}>
                    <TouchableOpacity
                        style={[styles.modeButton, mode === 'select' && styles.modeButtonActive]}
                        onPress={() => setMode('select')}
                    >
                        <Text
                            style={[
                                styles.modeButtonText,
                                mode === 'select' && styles.modeButtonTextActive,
                            ]}
                        >
                            マスタから選択
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeButton, mode === 'create' && styles.modeButtonActive]}
                        onPress={() => setMode('create')}
                    >
                        <Text
                            style={[
                                styles.modeButtonText,
                                mode === 'create' && styles.modeButtonTextActive,
                            ]}
                        >
                            新規作成
                        </Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6B8E6B" />
                    </View>
                ) : mode === 'select' ? (
                    <>
                        {selectedFood ? (
                            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                                <View style={styles.stockFormContainer}>
                                    <View style={styles.stockFormHeader}>
                                        <TouchableOpacity
                                            onPress={handleCancelStockForm}
                                            style={styles.backButton}
                                        >
                                            <Ionicons name="arrow-back" size={24} color="#6B8E6B" />
                                            <Text style={styles.backButtonText}>食材を選択</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.stockFormTitle}>在庫情報を入力</Text>
                                        <Text style={styles.stockFormSubtitle}>{selectedFood.name}</Text>
                                    </View>

                                    <View style={styles.form}>
                                        <View style={styles.formGroup}>
                                            <Text style={styles.label}>期限タイプ *</Text>
                                            <View style={styles.dateTypeSelector}>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.dateTypeOption,
                                                        stockFormData.date_type === 'best_before' && styles.dateTypeOptionActive,
                                                    ]}
                                                    onPress={() =>
                                                        setStockFormData({ ...stockFormData, date_type: 'best_before' })
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dateTypeOptionText,
                                                            stockFormData.date_type === 'best_before' && styles.dateTypeOptionTextActive,
                                                        ]}
                                                    >
                                                        賞味期限
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.dateTypeOption,
                                                        stockFormData.date_type === 'expiry' && styles.dateTypeOptionActive,
                                                    ]}
                                                    onPress={() =>
                                                        setStockFormData({ ...stockFormData, date_type: 'expiry' })
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dateTypeOptionText,
                                                            stockFormData.date_type === 'expiry' && styles.dateTypeOptionTextActive,
                                                        ]}
                                                    >
                                                        消費期限
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={styles.formGroup}>
                                            <Text style={styles.label}>
                                                {stockFormData.date_type === 'best_before' ? '賞味期限' : '消費期限'} *
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.dateInputButton}
                                                onPress={() => handleDatePickerOpen(false)}
                                            >
                                                <Text style={[
                                                    styles.dateInputText,
                                                    !stockFormData.expiry_date && styles.dateInputPlaceholder
                                                ]}>
                                                    {stockFormData.expiry_date || '日付を選択してください'}
                                                </Text>
                                                <Ionicons name="calendar-outline" size={20} color="#6B8E6B" />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.formGroup}>
                                            <Text style={styles.label}>保存タイプ *</Text>
                                            <View style={styles.storageTypeSelector}>
                                                {[
                                                    { id: 'refrigerator' as const, label: '冷蔵', icon: 'thermometer-outline' },
                                                    { id: 'freezer' as const, label: '冷凍', icon: 'snow-outline' },
                                                    { id: 'pantry' as const, label: '常温', icon: 'cube-outline' },
                                                ].map((type) => (
                                                    <TouchableOpacity
                                                        key={type.id}
                                                        style={[
                                                            styles.storageTypeOption,
                                                            stockFormData.storage_type === type.id && styles.storageTypeOptionActive,
                                                        ]}
                                                        onPress={() =>
                                                            setStockFormData({ ...stockFormData, storage_type: type.id })
                                                        }
                                                    >
                                                        <Ionicons
                                                            name={type.icon as any}
                                                            size={20}
                                                            color={stockFormData.storage_type === type.id ? '#6B8E6B' : '#9ca3af'}
                                                        />
                                                        <Text
                                                            style={[
                                                                styles.storageTypeOptionText,
                                                                stockFormData.storage_type === type.id && styles.storageTypeOptionTextActive,
                                                            ]}
                                                        >
                                                            {type.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>

                                        <View style={styles.formGroup}>
                                            <Text style={styles.label}>数量</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={stockFormData.quantity}
                                                onChangeText={(text) =>
                                                    setStockFormData({ ...stockFormData, quantity: text })
                                                }
                                                placeholder="例: 1個、300g"
                                                placeholderTextColor="#9ca3af"
                                            />
                                        </View>

                                        <View style={styles.stockFormButtons}>
                                            <TouchableOpacity
                                                style={[styles.submitButton, styles.submitButtonInRow, submitting && styles.submitButtonDisabled]}
                                                onPress={handleConfirmStockForm}
                                                disabled={submitting}
                                            >
                                                {submitting ? (
                                                    <ActivityIndicator color="#ffffff" />
                                                ) : (
                                                    <Text style={styles.submitButtonText}>追加する</Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        ) : (
                            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                                {/* 検索バー */}
                                <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="食材を検索..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>

                        {/* カテゴリーフィルター */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoryFilter}
                            contentContainerStyle={styles.categoryFilterContent}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === null && styles.categoryChipActive,
                                ]}
                                onPress={() => setSelectedCategory(null)}
                            >
                                <Text
                                    style={[
                                        styles.categoryChipText,
                                        selectedCategory === null && styles.categoryChipTextActive,
                                    ]}
                                >
                                    すべて
                                </Text>
                            </TouchableOpacity>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.categoryChip,
                                        selectedCategory === category.id && styles.categoryChipActive,
                                    ]}
                                    onPress={() => setSelectedCategory(category.id)}
                                >
                                    <Text
                                        style={[
                                            styles.categoryChipText,
                                            selectedCategory === category.id &&
                                                styles.categoryChipTextActive,
                                        ]}
                                    >
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* 食材リスト */}
                        <View style={styles.foodsList}>
                            {filteredFoods.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>食材が見つかりません</Text>
                                </View>
                            ) : (
                                filteredFoods.map((food) => (
                                    <TouchableOpacity
                                        key={food.id}
                                        style={[styles.foodItem, submitting && styles.foodItemDisabled]}
                                        onPress={() => !submitting && handleSelectFood(food)}
                                        disabled={submitting}
                                    >
                                        <View style={styles.foodItemContent}>
                                            <Text style={styles.foodItemName}>{food.name}</Text>
                                            {food.category && (
                                                <Text style={styles.foodItemCategory}>
                                                    {food.category.name}
                                                </Text>
                                            )}
                                        </View>
                                        {submitting ? (
                                            <ActivityIndicator size="small" color="#6B8E6B" />
                                        ) : (
                                            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                                        )}
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    </ScrollView>
                        )}
                    </>
                ) : (
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.form}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>食材名 *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.name}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, name: text })
                                    }
                                    placeholder="例: ほうれん草"
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>カテゴリー *</Text>
                                <View style={styles.categorySelector}>
                                    {categories.map((category) => (
                                        <TouchableOpacity
                                            key={category.id}
                                            style={[
                                                styles.categoryOption,
                                                formData.category_id === category.id &&
                                                    styles.categoryOptionActive,
                                            ]}
                                            onPress={() =>
                                                setFormData({ ...formData, category_id: category.id })
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryOptionText,
                                                    formData.category_id === category.id &&
                                                        styles.categoryOptionTextActive,
                                                ]}
                                            >
                                                {category.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>期限タイプ *</Text>
                                <View style={styles.dateTypeSelector}>
                                    <TouchableOpacity
                                        style={[
                                            styles.dateTypeOption,
                                            formData.date_type === 'best_before' && styles.dateTypeOptionActive,
                                        ]}
                                        onPress={() =>
                                            setFormData({ ...formData, date_type: 'best_before' })
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.dateTypeOptionText,
                                                formData.date_type === 'best_before' && styles.dateTypeOptionTextActive,
                                            ]}
                                        >
                                            賞味期限
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.dateTypeOption,
                                            formData.date_type === 'expiry' && styles.dateTypeOptionActive,
                                        ]}
                                        onPress={() =>
                                            setFormData({ ...formData, date_type: 'expiry' })
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.dateTypeOptionText,
                                                formData.date_type === 'expiry' && styles.dateTypeOptionTextActive,
                                            ]}
                                        >
                                            消費期限
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    {formData.date_type === 'best_before' ? '賞味期限' : '消費期限'} *
                                </Text>
                                <TouchableOpacity
                                    style={styles.dateInputButton}
                                    onPress={() => handleDatePickerOpen(true)}
                                >
                                    <Text style={[
                                        styles.dateInputText,
                                        !formData.expiry_date && styles.dateInputPlaceholder
                                    ]}>
                                        {formData.expiry_date || '日付を選択してください'}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={20} color="#6B8E6B" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>保存タイプ *</Text>
                                <View style={styles.storageTypeSelector}>
                                    {[
                                        { id: 'refrigerator' as const, label: '冷蔵', icon: 'thermometer-outline' },
                                        { id: 'freezer' as const, label: '冷凍', icon: 'snow-outline' },
                                        { id: 'pantry' as const, label: '常温', icon: 'cube-outline' },
                                    ].map((type) => (
                                        <TouchableOpacity
                                            key={type.id}
                                            style={[
                                                styles.storageTypeOption,
                                                formData.storage_type === type.id && styles.storageTypeOptionActive,
                                            ]}
                                            onPress={() =>
                                                setFormData({ ...formData, storage_type: type.id })
                                            }
                                        >
                                            <Ionicons
                                                name={type.icon as any}
                                                size={20}
                                                color={formData.storage_type === type.id ? '#6B8E6B' : '#9ca3af'}
                                            />
                                            <Text
                                                style={[
                                                    styles.storageTypeOptionText,
                                                    formData.storage_type === type.id && styles.storageTypeOptionTextActive,
                                                ]}
                                            >
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>数量</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.quantity}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, quantity: text })
                                    }
                                    placeholder="例: 1個、300g"
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>メモ</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={formData.memo}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, memo: text })
                                    }
                                    placeholder="メモを入力..."
                                    placeholderTextColor="#9ca3af"
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                                onPress={handleCreateFood}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>追加する</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                )}
            </View>

            {/* 日付ピッカーモーダル（マスタ選択時） */}
            {showDatePicker && selectedFood && (
                <Modal
                    visible={showDatePicker}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowDatePicker(false)}
                >
                    <View style={styles.datePickerModal}>
                        <View style={styles.datePickerContainer}>
                            <View style={styles.datePickerHeader}>
                                <Text style={styles.datePickerTitle}>日付を選択</Text>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(false)}
                                    style={styles.datePickerCloseButton}
                                >
                                    <Ionicons name="close" size={24} color="#3A4D3A" />
                                </TouchableOpacity>
                            </View>
                            {selectedDate && (
                                <View style={styles.customDatePicker}>
                                    <View style={styles.datePickerRow}>
                                        <View style={styles.datePickerColumn}>
                                            <Text style={styles.datePickerLabel}>年</Text>
                                            <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                                                {Array.from({ length: 10 }, (_, i) => {
                                                    const year = new Date().getFullYear() + i;
                                                    return (
                                                        <TouchableOpacity
                                                            key={year}
                                                            style={[
                                                                styles.datePickerOption,
                                                                selectedDate.year === year && styles.datePickerOptionActive,
                                                            ]}
                                                            onPress={() => {
                                                                const maxDay = getDaysInMonth(year, selectedDate.month);
                                                                setSelectedDate({
                                                                    ...selectedDate,
                                                                    year,
                                                                    day: Math.min(selectedDate.day, maxDay),
                                                                });
                                                            }}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.datePickerOptionText,
                                                                    selectedDate.year === year && styles.datePickerOptionTextActive,
                                                                ]}
                                                            >
                                                                {year}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </ScrollView>
                                        </View>
                                        <View style={styles.datePickerColumn}>
                                            <Text style={styles.datePickerLabel}>月</Text>
                                            <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                                                {Array.from({ length: 12 }, (_, i) => {
                                                    const month = i + 1;
                                                    return (
                                                        <TouchableOpacity
                                                            key={month}
                                                            style={[
                                                                styles.datePickerOption,
                                                                selectedDate.month === month && styles.datePickerOptionActive,
                                                            ]}
                                                            onPress={() => {
                                                                const maxDay = getDaysInMonth(selectedDate.year, month);
                                                                setSelectedDate({
                                                                    ...selectedDate,
                                                                    month,
                                                                    day: Math.min(selectedDate.day, maxDay),
                                                                });
                                                            }}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.datePickerOptionText,
                                                                    selectedDate.month === month && styles.datePickerOptionTextActive,
                                                                ]}
                                                            >
                                                                {month}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </ScrollView>
                                        </View>
                                        <View style={styles.datePickerColumn}>
                                            <Text style={styles.datePickerLabel}>日</Text>
                                            <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                                                {Array.from({ length: getDaysInMonth(selectedDate.year, selectedDate.month) }, (_, i) => {
                                                    const day = i + 1;
                                                    return (
                                                        <TouchableOpacity
                                                            key={day}
                                                            style={[
                                                                styles.datePickerOption,
                                                                selectedDate.day === day && styles.datePickerOptionActive,
                                                            ]}
                                                            onPress={() => setSelectedDate({ ...selectedDate, day })}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.datePickerOptionText,
                                                                    selectedDate.day === day && styles.datePickerOptionTextActive,
                                                                ]}
                                                            >
                                                                {day}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </ScrollView>
                                        </View>
                                    </View>
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.datePickerConfirmButton}
                                onPress={() => handleDatePickerConfirm(false)}
                            >
                                <Text style={styles.datePickerConfirmText}>決定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            {/* 日付ピッカーモーダル（新規作成時） */}
            {showCreateDatePicker && (
                <Modal
                    visible={showCreateDatePicker}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowCreateDatePicker(false)}
                >
                    <View style={styles.datePickerModal}>
                        <View style={styles.datePickerContainer}>
                            <View style={styles.datePickerHeader}>
                                <Text style={styles.datePickerTitle}>日付を選択</Text>
                                <TouchableOpacity
                                    onPress={() => setShowCreateDatePicker(false)}
                                    style={styles.datePickerCloseButton}
                                >
                                    <Ionicons name="close" size={24} color="#3A4D3A" />
                                </TouchableOpacity>
                            </View>
                            {selectedCreateDate && (
                                <View style={styles.customDatePicker}>
                                    <View style={styles.datePickerRow}>
                                        <View style={styles.datePickerColumn}>
                                            <Text style={styles.datePickerLabel}>年</Text>
                                            <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                                                {Array.from({ length: 10 }, (_, i) => {
                                                    const year = new Date().getFullYear() + i;
                                                    return (
                                                        <TouchableOpacity
                                                            key={year}
                                                            style={[
                                                                styles.datePickerOption,
                                                                selectedCreateDate.year === year && styles.datePickerOptionActive,
                                                            ]}
                                                            onPress={() => {
                                                                const maxDay = getDaysInMonth(year, selectedCreateDate.month);
                                                                setSelectedCreateDate({
                                                                    ...selectedCreateDate,
                                                                    year,
                                                                    day: Math.min(selectedCreateDate.day, maxDay),
                                                                });
                                                            }}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.datePickerOptionText,
                                                                    selectedCreateDate.year === year && styles.datePickerOptionTextActive,
                                                                ]}
                                                            >
                                                                {year}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </ScrollView>
                                        </View>
                                        <View style={styles.datePickerColumn}>
                                            <Text style={styles.datePickerLabel}>月</Text>
                                            <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                                                {Array.from({ length: 12 }, (_, i) => {
                                                    const month = i + 1;
                                                    return (
                                                        <TouchableOpacity
                                                            key={month}
                                                            style={[
                                                                styles.datePickerOption,
                                                                selectedCreateDate.month === month && styles.datePickerOptionActive,
                                                            ]}
                                                            onPress={() => {
                                                                const maxDay = getDaysInMonth(selectedCreateDate.year, month);
                                                                setSelectedCreateDate({
                                                                    ...selectedCreateDate,
                                                                    month,
                                                                    day: Math.min(selectedCreateDate.day, maxDay),
                                                                });
                                                            }}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.datePickerOptionText,
                                                                    selectedCreateDate.month === month && styles.datePickerOptionTextActive,
                                                                ]}
                                                            >
                                                                {month}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </ScrollView>
                                        </View>
                                        <View style={styles.datePickerColumn}>
                                            <Text style={styles.datePickerLabel}>日</Text>
                                            <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                                                {Array.from({ length: getDaysInMonth(selectedCreateDate.year, selectedCreateDate.month) }, (_, i) => {
                                                    const day = i + 1;
                                                    return (
                                                        <TouchableOpacity
                                                            key={day}
                                                            style={[
                                                                styles.datePickerOption,
                                                                selectedCreateDate.day === day && styles.datePickerOptionActive,
                                                            ]}
                                                            onPress={() => setSelectedCreateDate({ ...selectedCreateDate, day })}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.datePickerOptionText,
                                                                    selectedCreateDate.day === day && styles.datePickerOptionTextActive,
                                                                ]}
                                                            >
                                                                {day}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </ScrollView>
                                        </View>
                                    </View>
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.datePickerConfirmButton}
                                onPress={() => handleDatePickerConfirm(true)}
                            >
                                <Text style={styles.datePickerConfirmText}>決定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3A4D3A',
    },
    placeholder: {
        width: 32,
    },
    modeSelector: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 16,
        gap: 8,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
    },
    modeButtonActive: {
        backgroundColor: '#6B8E6B',
    },
    modeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
    },
    modeButtonTextActive: {
        color: '#ffffff',
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginHorizontal: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    categoryFilter: {
        marginBottom: 16,
    },
    categoryFilterContent: {
        paddingHorizontal: 24,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
    },
    categoryChipActive: {
        backgroundColor: '#6B8E6B',
    },
    categoryChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
    },
    categoryChipTextActive: {
        color: '#ffffff',
    },
    foodsList: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    foodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    foodItemDisabled: {
        opacity: 0.6,
    },
    foodItemContent: {
        flex: 1,
    },
    foodItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    foodItemCategory: {
        fontSize: 12,
        color: '#9ca3af',
    },
    emptyContainer: {
        paddingVertical: 48,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#9ca3af',
    },
    form: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1f2937',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    categorySelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categoryOptionActive: {
        backgroundColor: '#f0fdf4',
        borderColor: '#6B8E6B',
    },
    categoryOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
    },
    categoryOptionTextActive: {
        color: '#6B8E6B',
    },
    submitButton: {
        backgroundColor: '#6B8E6B',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonInRow: {
        flex: 1,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    storageTypeSelector: {
        flexDirection: 'row',
        gap: 8,
    },
    storageTypeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    storageTypeOptionActive: {
        backgroundColor: '#f0fdf4',
        borderColor: '#6B8E6B',
    },
    storageTypeOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9ca3af',
    },
    storageTypeOptionTextActive: {
        color: '#6B8E6B',
    },
    stockFormContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    stockFormHeader: {
        marginBottom: 24,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 8,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B8E6B',
        marginLeft: 8,
    },
    stockFormTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3A4D3A',
        marginBottom: 8,
    },
    stockFormSubtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
    stockFormButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
    },
    dateTypeSelector: {
        flexDirection: 'row',
        gap: 8,
    },
    dateTypeOption: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    dateTypeOptionActive: {
        backgroundColor: '#f0fdf4',
        borderColor: '#6B8E6B',
    },
    dateTypeOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9ca3af',
        textAlign: 'center',
    },
    dateTypeOptionTextActive: {
        color: '#6B8E6B',
        fontWeight: '600',
    },
    dateInputButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    dateInputText: {
        fontSize: 16,
        color: '#1f2937',
    },
    dateInputPlaceholder: {
        color: '#9ca3af',
    },
    datePickerModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    datePickerContainer: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    datePickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    datePickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3A4D3A',
    },
    datePickerCloseButton: {
        padding: 4,
    },
    datePickerConfirmButton: {
        backgroundColor: '#6B8E6B',
        borderRadius: 12,
        paddingVertical: 16,
        marginHorizontal: 24,
        marginTop: 16,
        alignItems: 'center',
    },
    datePickerConfirmText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    customDatePicker: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    datePickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 200,
    },
    datePickerColumn: {
        flex: 1,
        alignItems: 'center',
    },
    datePickerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 8,
    },
    datePickerScroll: {
        flex: 1,
        width: '100%',
    },
    datePickerOption: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 2,
        alignItems: 'center',
    },
    datePickerOptionActive: {
        backgroundColor: '#6B8E6B',
    },
    datePickerOptionText: {
        fontSize: 16,
        color: '#6b7280',
    },
    datePickerOptionTextActive: {
        color: '#ffffff',
        fontWeight: '600',
    },
});

