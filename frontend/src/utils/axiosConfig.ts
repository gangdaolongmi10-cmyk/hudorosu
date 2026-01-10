import axios from 'axios';
import { API_TIMEOUT } from '@shared/config';
import { getApiUrl } from '../config/env';

const apiClient = axios.create({
    baseURL: `${getApiUrl()}/api`, // フロントエンド用の環境変数から取得
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: API_TIMEOUT, // 共通設定から取得
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
