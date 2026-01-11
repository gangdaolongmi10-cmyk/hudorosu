import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { jwtHelper } from "../../utils/jwtHelper";
import { DEFAULT_ROLE } from "../../constants/role";
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
            return res.status(401).json({ 
                error: "メールアドレスまたはパスワードが正しくありません" 
            });
        }

        // 2. ローカル認証情報の取得
        const localAuth = await db.local_auth.findOne({
            where: { user_id: user.id },
        });

        if (!localAuth) {
            return res.status(401).json({ 
                error: "メールアドレスまたはパスワードが正しくありません" 
            });
        }

        // 3. パスワード検証
        const validPass = await bcrypt.compare(password, localAuth.password_hash);
        if (!validPass) {
            return res.status(401).json({ 
                error: "メールアドレスまたはパスワードが正しくありません" 
            });
        }

        // 4. ログインログを作成
        try {
            // IPアドレスの取得
            let ipAddress: string | null = null;
            const forwardedFor = req.headers['x-forwarded-for'];
            if (forwardedFor) {
                if (Array.isArray(forwardedFor)) {
                    ipAddress = forwardedFor[0];
                } else {
                    ipAddress = forwardedFor.split(',')[0].trim();
                }
            } else if (req.ip) {
                ipAddress = req.ip;
            } else if (req.connection && req.connection.remoteAddress) {
                ipAddress = req.connection.remoteAddress;
            }
            
            await db.login_logs.create({
                user_id: user.id,
                login_method: 'local',
                ip_address: ipAddress
            });
        } catch (logError) {
            // ログインログの作成に失敗してもログインは成功させる
            console.error('Login log creation error:', logError);
        }

        // 5. JWTトークンの発行
        const token = jwtHelper.createToken({
            id: user.id,
            email: user.email,
            role: user.role || DEFAULT_ROLE,
        });

        // 6. レスポンスを返す
        res.json({ 
            token,
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
