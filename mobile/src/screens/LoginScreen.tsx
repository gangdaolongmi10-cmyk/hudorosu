import React, { useState } from 'react';
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
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'login' | 'register';

interface ValidationErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
}

export default function LoginScreen() {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const { login, register } = useAuth();

    // メールアドレスのバリデーション
    const validateEmail = (email: string): string | undefined => {
        if (!email) {
            return 'メールアドレスを入力してください';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return '有効なメールアドレスを入力してください';
        }
        return undefined;
    };

    // パスワードのバリデーション
    const validatePassword = (password: string): string | undefined => {
        if (!password) {
            return 'パスワードを入力してください';
        }
        if (password.length < 6) {
            return 'パスワードは6文字以上である必要があります';
        }
        return undefined;
    };

    // 確認パスワードのバリデーション
    const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
        if (!confirmPassword) {
            return '確認パスワードを入力してください';
        }
        if (password !== confirmPassword) {
            return 'パスワードが一致しません';
        }
        return undefined;
    };

    // 名前のバリデーション（新規登録時のみ）
    const validateName = (name: string): string | undefined => {
        // 名前は任意なので、空でもOK
        return undefined;
    };

    // フォーム全体のバリデーション
    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;

        if (mode === 'register') {
            const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
            if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

            const nameError = validateName(name);
            if (nameError) newErrors.name = nameError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ログイン処理
    const handleLogin = async () => {
        if (!validateForm()) {
        return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
        } catch (error: any) {
            Alert.alert('ログインエラー', error.message || 'ログインに失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    // 新規登録処理
    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await register(email, password, name || undefined);
        } catch (error: any) {
            Alert.alert('登録エラー', error.message || 'ユーザー登録に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    // モード切り替え時にエラーをクリア
    const handleModeSwitch = (newMode: AuthMode) => {
        setMode(newMode);
        setErrors({});
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
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
            <View style={styles.content}>
            {/* モード切り替えタブ */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                style={[styles.tab, mode === 'login' && styles.tabActive]}
                onPress={() => handleModeSwitch('login')}
                >
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                    ログイン
                </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.tab, mode === 'register' && styles.tabActive]}
                onPress={() => handleModeSwitch('register')}
                >
                <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                    新規登録
                </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>
                {mode === 'login' ? 'ログイン' : '新規登録'}
            </Text>

            {/* 名前フィールド（新規登録時のみ） */}
            {mode === 'register' && (
                <View style={styles.inputContainer}>
                <Text style={styles.label}>名前（任意）</Text>
                <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="山田 太郎"
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
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>
            )}

            {/* メールアドレスフィールド */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>メールアドレス</Text>
                <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="email@example.com"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                    }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* パスワードフィールド */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>パスワード</Text>
                <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="パスワード"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                    }
                    // 確認パスワードのエラーもクリア（パスワード変更時）
                    if (errors.confirmPassword && mode === 'register') {
                    setErrors({ ...errors, confirmPassword: undefined });
                    }
                }}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* 確認パスワードフィールド（新規登録時のみ） */}
            {mode === 'register' && (
                <View style={styles.inputContainer}>
                <Text style={styles.label}>確認パスワード</Text>
                <TextInput
                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                    placeholder="パスワード（再入力）"
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
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
                </View>
            )}

            {/* 送信ボタン */}
            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={mode === 'login' ? handleLogin : handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                <ActivityIndicator color="#fff" />
                ) : (
                <Text style={styles.buttonText}>
                    {mode === 'login' ? 'ログイン' : '新規登録'}
                </Text>
                )}
            </TouchableOpacity>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 30,
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
        backgroundColor: '#007AFF',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    tabTextActive: {
        color: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
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
        backgroundColor: '#007AFF',
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
