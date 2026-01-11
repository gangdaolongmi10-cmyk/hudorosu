import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { jwtHelper } from "../../utils/jwtHelper";
import { DEFAULT_ROLE } from "../../constants/role";
import { getClientIp } from "../../utils/ipHelper";
import { isAccountLocked, incrementFailedLoginAttempts, resetFailedLoginAttempts, getRemainingLockTime } from "../../utils/accountLockHelper";
import db from "../../../models";

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // バリデーション
        if (!email || !password) {
            return res.status(400).json({ 
                error: "メールアドレスとパスワードを入力してください" 
            });
        }

        // 1. ユーザーの存在確認（DBから取得）
        const user = await db.users.findOne({
            where: { email },
        });

        if (!user) {
            // ユーザーが存在しない場合も、セキュリティのため同じエラーメッセージを返す
            return res.status(401).json({ 
                error: "メールアドレスまたはパスワードが正しくありません" 
            });
        }

        // 2. アカウントロックチェック
        if (isAccountLocked(user)) {
            const remainingMinutes = getRemainingLockTime(user);
            return res.status(423).json({ 
                error: `アカウントがロックされています。${remainingMinutes}分後に再試行してください。` 
            });
        }

        // 3. ローカル認証情報の取得
        const localAuth = await db.local_auth.findOne({
            where: { user_id: user.id },
        });

        if (!localAuth) {
            // 認証情報が存在しない場合も失敗回数を増やす
            await incrementFailedLoginAttempts(user.id);
            return res.status(401).json({ 
                error: "メールアドレスまたはパスワードが正しくありません" 
            });
        }

        // 4. パスワード検証
        const validPass = await bcrypt.compare(password, localAuth.password_hash);
        if (!validPass) {
            // パスワードが間違っている場合、失敗回数を増やす
            const isLocked = await incrementFailedLoginAttempts(user.id);
            if (isLocked) {
                return res.status(423).json({ 
                    error: `ログイン試行回数が上限に達しました。アカウントが${getRemainingLockTime(await db.users.findByPk(user.id))}分間ロックされます。` 
                });
            }
            return res.status(401).json({ 
                error: "メールアドレスまたはパスワードが正しくありません" 
            });
        }

        // 5. ログイン成功 - 失敗回数をリセット
        await resetFailedLoginAttempts(user.id);

        // 6. IPアドレスとユーザーエージェントの取得
        const ipAddress = getClientIp(req);
        const userAgent = req.headers['user-agent'] || null;

        // 7. ログインログを作成
        try {
            await db.login_logs.create({
                user_id: user.id,
                login_method: 'local',
                ip_address: ipAddress
            });
        } catch (logError) {
            console.error('Login log creation error:', logError);
        }

        // 8. アクセストークンとリフレッシュトークンの発行
        const accessToken = jwtHelper.createAccessToken({
            id: user.id,
            email: user.email,
            role: user.role || DEFAULT_ROLE,
        });

        const refreshToken = jwtHelper.createRefreshToken({
            id: user.id,
            email: user.email,
            role: user.role || DEFAULT_ROLE,
        });

        // 9. セッションをデータベースに保存
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7日後

        try {
            await db.sessions.create({
                user_id: user.id,
                refresh_token: refreshToken,
                ip_address: ipAddress,
                user_agent: userAgent,
                expires_at: expiresAt
            });
        } catch (sessionError) {
            console.error('Session creation error:', sessionError);
            // セッション作成に失敗してもログインは成功させる
        }

        // 10. ユーザー情報を更新（最終ログイン情報）
        await db.users.update(
            {
                last_login_ip: ipAddress,
                last_login_at: new Date()
            },
            { where: { id: user.id } }
        );

        // 11. レスポンスを返す
        res.json({ 
            token: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            error: "サーバーエラーが発生しました" 
        });
    }
};
