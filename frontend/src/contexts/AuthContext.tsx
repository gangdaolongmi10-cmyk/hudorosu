import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: number;
    email: string;
    name?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 初期化時にlocalStorageからトークンを読み込む
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken) {
            setToken(storedToken);
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error('Failed to parse stored user:', e);
                }
            }
        }
        setIsLoading(false);
    }, []);

    // ログイン処理
    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('http://localhost:3000/api/admin/login', {
                email,
                password,
            });

            const { token: newToken, user: newUser } = response.data;
            
            setToken(newToken);
            setUser(newUser);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.error || 'ログインに失敗しました');
            } else {
                throw new Error('ネットワークエラーが発生しました');
            }
        }
    };

    // ログアウト処理
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // ユーザー情報の更新
    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

