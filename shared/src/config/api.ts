/**
 * 共通API設定
 * すべてのアプリ（バックエンド、フロントエンド、モバイル）で使用
 */

export interface ApiConfig {
    baseUrl: string;
    timeout: number;
    apiPrefix: string;
}

/**
 * 環境タイプ
 */
export type Environment = 'development' | 'production' | 'test';

/**
 * 環境を取得
 */
export const getEnvironment = (): Environment => {
    // Node.js環境（processが存在する場合）
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) {
        return (process.env.NODE_ENV as Environment) || 'development';
    }

    // ブラウザ環境またはその他の環境
    // Expo環境の検知は動的インポートやグローバル変数を介して行うのが安全
    if (typeof window !== 'undefined' && (window as any).Expo) {
        return 'development'; // 仮
    }

    return 'development';
};

/**
 * 環境変数を安全に取得するヘルパー関数
 * 注意: フロントエンド（Vite）では使用しないでください。
 * フロントエンドでは frontend/src/config/env.ts を使用してください。
 */
const getEnvVar = (key: string, defaultValue: string): string => {
    // Node.js環境（バックエンド）のみ
    if (typeof process !== 'undefined' && process.env) {
        const value = process.env[key];
        if (value && typeof value === 'string') return value;
    }

    return defaultValue;
};

/**
 * 開発環境のAPI URL
 */
export const DEV_API_URL = getEnvVar('DEV_API_URL', 'http://localhost:3001');

/**
 * 本番環境のAPI URL
 */
export const PROD_API_URL = getEnvVar('PROD_API_URL', 'https://your-production-api.com');

/**
 * APIプレフィックス
 */
export const API_PREFIX = '/api';

/**
 * APIタイムアウト（ミリ秒）
 */
export const API_TIMEOUT = 10000;

/**
 * 現在の環境に応じたAPI設定を取得
 */
export const getApiConfig = (): ApiConfig => {
    const env = getEnvironment();
    const baseUrl = env === 'production' ? PROD_API_URL : DEV_API_URL;

    return {
        baseUrl,
        timeout: API_TIMEOUT,
        apiPrefix: API_PREFIX,
    };
};

/**
 * 完全なAPI URLを取得
 */
export const getApiBaseUrl = (): string => {
    const config = getApiConfig();
    return `${config.baseUrl}${config.apiPrefix}`;
};

/**
 * CORS許可オリジン（開発環境）
 */
export const DEV_ALLOWED_ORIGINS = [
    'http://localhost:5173',  // フロントエンド（Vite）
    'http://localhost:8081',  // モバイルアプリ（Expo）
    'http://127.0.0.1:8081',  // モバイルアプリ（Expo - 別形式）
];

/**
 * CORS許可オリジン（本番環境）
 */
export const PROD_ALLOWED_ORIGINS = (() => {
    const frontendUrl = getEnvVar('FRONTEND_URL', '');
    return frontendUrl
        ? frontendUrl.split(',').map(url => url.trim())
        : [];
})();

/**
 * 現在の環境に応じたCORS許可オリジンを取得
 */
export const getAllowedOrigins = (): string[] => {
    const env = getEnvironment();
    return env === 'production' ? PROD_ALLOWED_ORIGINS : DEV_ALLOWED_ORIGINS;
};
