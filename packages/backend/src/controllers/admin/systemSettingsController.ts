import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { settingsRepository } from '../../repositories/settingsRepository';

/**
 * アプリ名を取得（認証済みユーザーなら誰でも取得可能）
 */
export const getAppNameController = async (req: AuthRequest, res: Response) => {
    try {
        const appNameSetting = await settingsRepository.findByKey('app_name');
        const appName = appNameSetting?.value || 'ふどろす';
        res.status(200).json({ app_name: appName });
    } catch (error) {
        console.error('Get app name error:', error);
        // エラーが発生してもデフォルト値を返す
        res.status(200).json({ app_name: 'ふどろす' });
    }
};

/**
 * システム設定一覧を取得
 */
export const getSystemSettingsController = async (req: AuthRequest, res: Response) => {
    try {
        const settings = await settingsRepository.findAll();
        
        // キー・バリュー形式に変換
        const settingsMap: Record<string, any> = {};
        settings.forEach((setting: any) => {
            settingsMap[setting.key] = {
                value: setting.value,
                description: setting.description,
                id: setting.id,
                created_at: setting.created_at,
                updated_at: setting.updated_at
            };
        });

        res.status(200).json(settingsMap);
    } catch (error) {
        console.error('Get system settings error:', error);
        res.status(500).json({ error: 'システム設定の取得中にエラーが発生しました' });
    }
};

/**
 * システム設定を更新
 */
export const updateSystemSettingsController = async (req: AuthRequest, res: Response) => {
    try {
        const { settings } = req.body;

        // バリデーション
        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({ 
                error: '設定データが正しくありません' 
            });
        }

        // 各設定のバリデーション
        if (settings.password_min_length !== undefined) {
            const minLength = parseInt(settings.password_min_length, 10);
            if (isNaN(minLength) || minLength < 4 || minLength > 32) {
                return res.status(400).json({ 
                    error: 'パスワードの最小文字数は4-32の範囲で指定してください' 
                });
            }
        }

        if (settings.session_timeout !== undefined) {
            const timeout = parseInt(settings.session_timeout, 10);
            if (isNaN(timeout) || timeout < 1 || timeout > 168) {
                return res.status(400).json({ 
                    error: 'セッションタイムアウトは1-168時間の範囲で指定してください' 
                });
            }
        }

        if (settings.max_login_attempts !== undefined) {
            const attempts = parseInt(settings.max_login_attempts, 10);
            if (isNaN(attempts) || attempts < 1 || attempts > 20) {
                return res.status(400).json({ 
                    error: '最大ログイン試行回数は1-20の範囲で指定してください' 
                });
            }
        }

        if (settings.maintenance_mode !== undefined) {
            if (settings.maintenance_mode !== 'true' && settings.maintenance_mode !== 'false') {
                return res.status(400).json({ 
                    error: 'メンテナンスモードはtrueまたはfalseを指定してください' 
                });
            }
        }

        // 設定を更新
        await settingsRepository.updateMultiple(settings);

        // 更新後の設定を取得
        const updatedSettings = await settingsRepository.findAll();
        const settingsMap: Record<string, any> = {};
        updatedSettings.forEach((setting: any) => {
            settingsMap[setting.key] = {
                value: setting.value,
                description: setting.description,
                id: setting.id,
                created_at: setting.created_at,
                updated_at: setting.updated_at
            };
        });

        res.status(200).json({
            message: 'システム設定が正常に更新されました',
            settings: settingsMap
        });
    } catch (error: any) {
        console.error('Update system settings error:', error);
        res.status(500).json({ 
            error: 'システム設定の更新中にエラーが発生しました' 
        });
    }
};

