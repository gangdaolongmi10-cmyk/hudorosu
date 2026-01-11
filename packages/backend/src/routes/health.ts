import { Router, Request, Response } from "express";
import db from "../../models";

const router = Router();

/**
 * ヘルスチェックエンドポイント
 * サーバーとデータベースの接続状態を確認
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        // データベース接続チェック
        await db.sequelize.authenticate();
        
        res.status(200).json({ 
            status: "ok",
            database: "connected",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        // データベース接続エラー
        console.error("Health check failed:", error);
        res.status(503).json({ 
            status: "error",
            database: "disconnected",
            message: "Database connection failed"
        });
    }
});

export default router;
