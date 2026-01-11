import { Request, Response, NextFunction } from "express";
import { jwtHelper } from "../utils/jwtHelper";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role?: string;
    };
    query: Request["query"];
    body: Request["body"];
    params: Request["params"];
    headers: Request["headers"];
    file?: any;
    files?: any;
}

/**
 * JWT認証ミドルウェア
 * Authorizationヘッダーからトークンを取得し、検証する
 */
export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Authorizationヘッダーからトークンを取得
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                error: "認証トークンが提供されていません" 
            });
        }

        // Bearerトークンの形式を確認
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ 
                error: "認証トークンの形式が正しくありません" 
            });
        }

        const token = parts[1];

        // トークンの検証（アクセストークン）
        const decoded = jwtHelper.verifyAccessToken(token);
        
        if (!decoded || typeof decoded !== "object") {
            return res.status(401).json({ 
                error: "無効な認証トークンです。再ログインしてください。" 
            });
        }

        // リクエストオブジェクトにユーザー情報を追加
        req.user = {
            id: (decoded as any).id,
            email: (decoded as any).email,
            role: (decoded as any).role,
        };

        next();
    } catch (error) {
        console.error("認証エラー:", error);
        return res.status(401).json({ 
            error: "認証に失敗しました" 
        });
    }
};

