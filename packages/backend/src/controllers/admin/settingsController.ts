import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import * as bcrypt from "bcryptjs";
import db from "../../../models";

/**
 * 現在のユーザー情報を取得
 */
export const getCurrentUserController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "認証が必要です" });
        }

        const user = await db.users.findByPk(req.user.id, {
            attributes: ['id', 'email', 'name', 'role', 'avatar_url', 'created_at', 'updated_at'],
        });

        if (!user) {
            return res.status(404).json({ error: "ユーザーが見つかりません" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({ error: "サーバーエラーが発生しました" });
    }
};

/**
 * ユーザー情報を更新
 */
export const updateUserController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "認証が必要です" });
        }

        const { name, email, avatar_url } = req.body;

        // バリデーション
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "有効なメールアドレスを入力してください" });
        }

        const user = await db.users.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "ユーザーが見つかりません" });
        }

        // メールアドレスの重複チェック
        if (email && email !== user.email) {
            const existingUser = await db.users.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: "このメールアドレスは既に使用されています" });
            }
        }

        // 更新
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

        await user.update(updateData);

        const updatedUser = await db.users.findByPk(req.user.id, {
            attributes: ['id', 'email', 'name', 'role', 'avatar_url', 'created_at', 'updated_at'],
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ error: "サーバーエラーが発生しました" });
    }
};

/**
 * パスワードを変更
 */
export const changePasswordController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "認証が必要です" });
        }

        const { currentPassword, newPassword } = req.body;

        // バリデーション
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "現在のパスワードと新しいパスワードを入力してください" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: "新しいパスワードは6文字以上である必要があります" });
        }

        // ローカル認証情報の取得
        const localAuth = await db.local_auth.findOne({
            where: { user_id: req.user.id },
        });

        if (!localAuth) {
            return res.status(404).json({ error: "認証情報が見つかりません" });
        }

        // 現在のパスワードの検証
        const validPass = await bcrypt.compare(currentPassword, localAuth.password_hash);
        if (!validPass) {
            return res.status(401).json({ error: "現在のパスワードが正しくありません" });
        }

        // 新しいパスワードのハッシュ化
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // パスワードの更新
        await localAuth.update({ password_hash: passwordHash });

        res.status(200).json({ message: "パスワードが正常に変更されました" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: "サーバーエラーが発生しました" });
    }
};

