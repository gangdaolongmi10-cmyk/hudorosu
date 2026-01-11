/**
 * フロントエンド用の環境変数設定
 * Vite環境では import.meta.env を使用
 * 型定義は vite-env.d.ts で定義されています
 */

/**
 * 開発環境のAPI URL
 */
export const getDevApiUrl = (): string => {
    // Vite環境変数から取得
    if (import.meta.env.VITE_DEV_API_URL) {
        return import.meta.env.VITE_DEV_API_URL;
    }
    // デフォルト値
    return 'http://localhost:3000';
};

/**
 * 本番環境のAPI URL
 */
export const getProdApiUrl = (): string => {
    // Vite環境変数から取得
    if (import.meta.env.VITE_PROD_API_URL) {
        return import.meta.env.VITE_PROD_API_URL;
    }
    // デフォルト値
    return 'https://your-production-api.com';
};

/**
 * 現在の環境に応じたAPI URLを取得
 */
export const getApiUrl = (): string => {
    const isProduction = import.meta.env.MODE === 'production';
    return isProduction ? getProdApiUrl() : getDevApiUrl();
};
