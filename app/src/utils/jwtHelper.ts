import * as jwt from "jsonwebtoken";

export interface JWTPayload {
    id: number;
    email: string;
    role?: string;
}

export class jwtHelper {
    // 環境変数からシークレットを取得、なければデフォルト値を使用
    static jweSecret = process.env.JWT_SECRET || "your-secret-key-change-in-production";
    
    /**
     * JWTトークンを作成
     * @param payload トークンに含めるユーザー情報
     * @param expiresIn 有効期限（デフォルト: 24時間）
     * @returns JWTトークン
     */
    static createToken(payload: JWTPayload, expiresIn: string = "24h"): string {
        // Renderでのビルド時の型エラーを回避
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const token = jwt.sign(payload, this.jweSecret, {
            expiresIn: expiresIn,
        });
        return token as string;
    }
    
    /**
     * JWTトークンを検証
     * @param token 検証するトークン
     * @returns デコードされたペイロード、またはnull
     */
    static verifyToken(token: string): JWTPayload | null {
        try {
            const decoded = jwt.verify(token, this.jweSecret) as JWTPayload;
            return decoded;
        } catch (err) {
            console.error("JWT検証エラー:", err);
            return null;
        }
    }
}