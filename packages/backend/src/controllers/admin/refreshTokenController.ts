import { Request, Response } from "express";
import { jwtHelper } from "../../utils/jwtHelper";
import { DEFAULT_ROLE } from "../../constants/role";
import db from "../../../models";

/**
 * リフレッシュトークンを使用して新しいアクセストークンを取得
 */
export const refreshTokenController = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                error: "リフレッシュトークンが必要です"
            });
        }

        // 1. リフレッシュトークンの検証
        const decoded = jwtHelper.verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({
                error: "無効なリフレッシュトークンです"
            });
        }

        // 2. データベースからセッションを確認
        const session = await db.sessions.findOne({
            where: {
                refresh_token: refreshToken,
                revoked_at: null
            }
        });

        if (!session) {
            return res.status(401).json({
                error: "セッションが見つかりません"
            });
        }

        // 3. セッションの有効期限をチェック
        const expiresAt = new Date(session.expires_at);
        if (expiresAt <= new Date()) {
            // セッションを無効化
            await db.sessions.update(
                { revoked_at: new Date() },
                { where: { id: session.id } }
            );
            return res.status(401).json({
                error: "セッションの有効期限が切れています"
            });
        }

        // 4. ユーザー情報を取得
        const user = await db.users.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({
                error: "ユーザーが見つかりません"
            });
        }

        // 5. 新しいアクセストークンを発行
        const newAccessToken = jwtHelper.createAccessToken({
            id: user.id,
            email: user.email,
            role: user.role || DEFAULT_ROLE,
        });

        // 6. レスポンスを返す
        res.json({
            token: newAccessToken
        });
    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json({
            error: "サーバーエラーが発生しました"
        });
    }
};

/**
 * ログアウト処理（セッションを無効化）
 */
export const logoutController = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            // セッションを無効化
            await db.sessions.update(
                { revoked_at: new Date() },
                { where: { refresh_token: refreshToken, revoked_at: null } }
            );
        }

        res.json({
            message: "ログアウトしました"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            error: "サーバーエラーが発生しました"
        });
    }
};
