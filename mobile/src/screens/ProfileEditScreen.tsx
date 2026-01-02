import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { updateUser, changePassword } from '../services/userService';
import * as ImagePicker from 'expo-image-picker';

type ActiveTab = 'profile' | 'password';

export default function ProfileEditScreen({ onBack }: { onBack: () => void }) {
    const { user, updateUser: updateAuthUser } = useAuth();
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [isLoading, setIsLoading] = useState(false);

    // プロフィール編集用の状態
    const [name, setName] = useState('');
    const [avatarUri, setAvatarUri] = useState<string | null>(null);

    // パスワード変更用の状態
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // エラー状態
    const [errors, setErrors] = useState<{
        name?: string;
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setAvatarUri(user.avatar_url || null);
        }
    }, [user]);

    // 画像選択の許可をリクエスト
    const requestImagePermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    '許可が必要です',
                    '画像を選択するには、カメラロールへのアクセス許可が必要です。',
                    [{ text: 'OK' }]
                );
                return false;
            }
        }
        return true;
    };

    // 画像を選択
    const pickImage = async () => {
        const hasPermission = await requestImagePermission();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                // base64データがある場合はそれを使用、ない場合はURIを使用
                if (asset.base64) {
                    const base64Image = `data:image/jpeg;base64,${asset.base64}`;
                    setAvatarUri(base64Image);
                } else {
                    setAvatarUri(asset.uri);
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('エラー', '画像の選択に失敗しました');
        }
    };

    // 画像を削除
    const removeImage = () => {
        Alert.alert(
            '画像を削除',
            'プロフィール画像を削除しますか？',
            [
                { text: 'キャンセル', style: 'cancel' },
                {
                    text: '削除',
                    style: 'destructive',
                    onPress: () => setAvatarUri(null),
                },
            ]
        );
    };

    // バリデーション
    const validateProfile = (): boolean => {
        const newErrors: typeof errors = {};
        if (name.trim().length > 100) {
            newErrors.name = '名前は100文字以内で入力してください';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = (): boolean => {
        const newErrors: typeof errors = {};

        if (!currentPassword) {
            newErrors.currentPassword = '現在のパスワードを入力してください';
        }

        if (!newPassword) {
            newErrors.newPassword = '新しいパスワードを入力してください';
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'パスワードは6文字以上である必要があります';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = '確認パスワードを入力してください';
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'パスワードが一致しません';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // プロフィール更新
    const handleProfileUpdate = async () => {
        if (!validateProfile()) {
            return;
        }

        setIsLoading(true);
        try {
            let avatarUrl: string | undefined | null = user?.avatar_url;
            
            // 新しい画像が選択されている場合
            if (avatarUri) {
                // base64データ（data:image/...で始まる）の場合はそのまま使用
                // 既存のURL（http://...で始まる）の場合もそのまま使用
                avatarUrl = avatarUri;
            } else if (avatarUri === null) {
                // 画像が削除された場合
                avatarUrl = null;
            }

            const updatedUser = await updateUser({
                name: name.trim() || undefined,
                avatar_url: avatarUrl,
            });
            updateAuthUser(updatedUser);
            Alert.alert('成功', 'プロフィールが更新されました');
            onBack();
        } catch (error: any) {
            Alert.alert('エラー', error.message || 'プロフィールの更新に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    // パスワード変更
    const handlePasswordChange = async () => {
        if (!validatePassword()) {
            return;
        }

        setIsLoading(true);
        try {
            await changePassword({
                currentPassword,
                newPassword,
            });
            Alert.alert('成功', 'パスワードが変更されました');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setErrors({});
        } catch (error: any) {
            Alert.alert('エラー', error.message || 'パスワードの変更に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* ヘッダー */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#3A4D3A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>プロフィール編集</Text>
                    <View style={styles.headerPlaceholder} />
                </View>

                {/* タブ切り替え */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
                        onPress={() => setActiveTab('profile')}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'profile' && styles.tabTextActive,
                            ]}
                        >
                            プロフィール
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'password' && styles.tabActive]}
                        onPress={() => setActiveTab('password')}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'password' && styles.tabTextActive,
                            ]}
                        >
                            パスワード
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* プロフィール編集タブ */}
                {activeTab === 'profile' && (
                    <View style={styles.content}>
                        {/* プロフィール画像 */}
                        <View style={styles.avatarSection}>
                            <View style={styles.avatarContainer}>
                                {avatarUri ? (
                                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <Ionicons name="person" size={40} color="#9ca3af" />
                                    </View>
                                )}
                            </View>
                            <View style={styles.avatarButtons}>
                                <TouchableOpacity
                                    style={styles.avatarButton}
                                    onPress={pickImage}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="camera" size={20} color="#6B8E6B" />
                                    <Text style={styles.avatarButtonText}>変更</Text>
                                </TouchableOpacity>
                                {avatarUri && (
                                    <TouchableOpacity
                                        style={[styles.avatarButton, styles.avatarButtonDanger]}
                                        onPress={removeImage}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="trash" size={20} color="#f87171" />
                                        <Text
                                            style={[
                                                styles.avatarButtonText,
                                                styles.avatarButtonTextDanger,
                                            ]}
                                        >
                                            削除
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* 名前入力 */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>名前</Text>
                            <TextInput
                                style={[styles.input, errors.name && styles.inputError]}
                                placeholder="名前を入力"
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    if (errors.name) {
                                        setErrors({ ...errors, name: undefined });
                                    }
                                }}
                                autoCapitalize="words"
                                editable={!isLoading}
                            />
                            {errors.name && (
                                <Text style={styles.errorText}>{errors.name}</Text>
                            )}
                        </View>

                        {/* 更新ボタン */}
                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleProfileUpdate}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>更新</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {/* パスワード変更タブ */}
                {activeTab === 'password' && (
                    <View style={styles.content}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>現在のパスワード</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.currentPassword && styles.inputError,
                                ]}
                                placeholder="現在のパスワードを入力"
                                value={currentPassword}
                                onChangeText={(text) => {
                                    setCurrentPassword(text);
                                    if (errors.currentPassword) {
                                        setErrors({ ...errors, currentPassword: undefined });
                                    }
                                }}
                                secureTextEntry
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                            {errors.currentPassword && (
                                <Text style={styles.errorText}>
                                    {errors.currentPassword}
                                </Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>新しいパスワード</Text>
                            <TextInput
                                style={[styles.input, errors.newPassword && styles.inputError]}
                                placeholder="新しいパスワードを入力"
                                value={newPassword}
                                onChangeText={(text) => {
                                    setNewPassword(text);
                                    if (errors.newPassword) {
                                        setErrors({ ...errors, newPassword: undefined });
                                    }
                                    // 確認パスワードのエラーもクリア
                                    if (errors.confirmPassword) {
                                        setErrors({ ...errors, confirmPassword: undefined });
                                    }
                                }}
                                secureTextEntry
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                            {errors.newPassword && (
                                <Text style={styles.errorText}>{errors.newPassword}</Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>確認パスワード</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.confirmPassword && styles.inputError,
                                ]}
                                placeholder="新しいパスワード（再入力）"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (errors.confirmPassword) {
                                        setErrors({ ...errors, confirmPassword: undefined });
                                    }
                                }}
                                secureTextEntry
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>
                                    {errors.confirmPassword}
                                </Text>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handlePasswordChange}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>パスワードを変更</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAECE9',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 96,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3A4D3A',
    },
    headerPlaceholder: {
        width: 40,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        marginTop: 16,
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 6,
    },
    tabActive: {
        backgroundColor: '#6B8E6B',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    tabTextActive: {
        color: '#fff',
    },
    content: {
        paddingHorizontal: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#6B8E6B',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
    },
    avatarButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    avatarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#6B8E6B',
    },
    avatarButtonDanger: {
        borderColor: '#f87171',
    },
    avatarButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B8E6B',
    },
    avatarButtonTextDanger: {
        color: '#f87171',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#666',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#ff3b30',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    button: {
        backgroundColor: '#6B8E6B',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

