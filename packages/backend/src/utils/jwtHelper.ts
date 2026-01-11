import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

export interface JWTPayload {
    id: number;
    email: string;
    role?: string;
}

export class jwtHelper {
    // 環境変数からシークレットを取得、なければデフォルト値を使用
    static jweSecret = process.env.JWT_SECRET || "your-secret-key-change-in-production";
    static refreshSecret = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production";
    
    // アクセストークンの有効期限（15分）
    static ACCESS_TOKEN_EXPIRES_IN = "15m";
    // リフレッシュトークンの有効期限（7日）
    static REFRESH_TOKEN_EXPIRES_IN = "7d";
    
    /**
     * アクセストークンを作成（短い有効期限）
     * @param payload トークンに含めるユーザー情報
     * @returns JWTトークン
     */
    static createAccessToken(payload: JWTPayload): string {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const token = jwt.sign(payload, this.jweSecret, {
            expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
        });
        return token as string;
    }
    
    /**
     * リフレッシュトークンを作成（長い有効期限）
     * @param payload トークンに含めるユーザー情報
     * @returns JWTトークン
     */
    static createRefreshToken(payload: JWTPayload): string {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const token = jwt.sign(payload, this.refreshSecret, {
            expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
        });
        return token as string;
    }
    
    /**
     * レガシー互換性のため、従来のcreateTokenメソッドを残す（アクセストークンとして使用）
     * @param payload トークンに含めるユーザー情報
     * @param expiresIn 有効期限（デフォルト: 15分）
     * @returns JWTトークン
     */
    static createToken(payload: JWTPayload, expiresIn: string = this.ACCESS_TOKEN_EXPIRES_IN): string {
        return this.createAccessToken(payload);
    }
    
    /**
     * アクセストークンを検証
     * @param token 検証するトークン
     * @returns デコードされたペイロード、またはnull
     */
    static verifyAccessToken(token: string): JWTPayload | null {
        try {
            const decoded = jwt.verify(token, this.jweSecret) as JWTPayload;
            return decoded;
        } catch (err) {
            console.error("JWT検証エラー:", err);
            return null;
        }
    }
    
    /**
     * リフレッシュトークンを検証
     * @param token 検証するトークン
     * @returns デコードされたペイロード、またはnull
     */
    static verifyRefreshToken(token: string): JWTPayload | null {
        try {
            const decoded = jwt.verify(token, this.refreshSecret) as JWTPayload;
            return decoded;
        } catch (err) {
            console.error("リフレッシュトークン検証エラー:", err);
            return null;
        }
    }
    
    /**
     * レガシー互換性のため、従来のverifyTokenメソッドを残す
     * @param token 検証するトークン
     * @returns デコードされたペイロード、またはnull
     */
    static verifyToken(token: string): JWTPayload | null {
        return this.verifyAccessToken(token);
    }
    
    /**
     * ランダムなセッションIDを生成
     * @returns セッションID
     */
    static generateSessionId(): string {
        return crypto.randomBytes(32).toString('hex');
    }
}