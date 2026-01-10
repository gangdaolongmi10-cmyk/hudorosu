import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { getApiBaseUrl as getSharedApiBaseUrl, API_TIMEOUT } from '@shared/config';

// 開発環境では、コンピュータのIPアドレスを使用してください
// 例: 'http://192.168.1.100:3000/api'
// 実際のIPアドレスを確認するには、ターミナルで `ipconfig getifaddr en0` (macOS) または `ipconfig` (Windows) を実行してください
// 
// 実機でテストする場合は、以下のIPアドレスをあなたのコンピュータのIPアドレスに変更してください
// 例: 'http://192.168.1.100:3000/api'
const DEV_IP_ADDRESS = process.env.DEV_IP_ADDRESS || 'localhost'; // 環境変数またはデフォルト値

const getApiBaseUrl = () => {
    // 本番環境の場合
    if (Constants.executionEnvironment === 'standalone' || Constants.executionEnvironment === 'storeClient') {
        return getSharedApiBaseUrl(); // 共通設定から取得
    }
    
    // 開発環境の場合
    // 実機でテストする場合は、DEV_IP_ADDRESS を IP アドレスに変更
    if (DEV_IP_ADDRESS === 'localhost') {
        // エミュレータ/シミュレータの場合
        return 'http://localhost:3000/api';
    }
    // 実機の場合（IPアドレスが設定されている）
    return `http://${DEV_IP_ADDRESS}:3000/api`;
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: API_TIMEOUT, // 共通設定から取得
});

apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token from storage:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');
            } catch (storageError) {
                console.error('Error removing token from storage:', storageError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
