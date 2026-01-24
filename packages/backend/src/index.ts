import express, { Application } from "express";
import cors from "cors";
import path from "path";
import healthRoutes from "./routes/health";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import { getAllowedOrigins } from "@shared/config";

// 環境変数の検証
const requiredEnvVars = ['JWT_SECRET'];
if (process.env.NODE_ENV === 'production') {
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.error(`❌ エラー: 以下の環境変数が設定されていません: ${missingVars.join(', ')}`);
        process.exit(1);
    }

    // JWT_SECRETがデフォルト値のままの場合
    if (process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
        console.error('❌ エラー: JWT_SECRETを本番環境用の強力な値に変更してください');
        process.exit(1);
    }
}

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3001', 10);

// Trust proxy（リバースプロキシ経由の場合にIPアドレスを正しく取得するため）
app.set('trust proxy', true);

// CORS設定（共通設定から取得）
const allowedOrigins = getAllowedOrigins();

app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // オリジンが未定義の場合（例: モバイルアプリ、Postmanなど）も許可
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy: Origin not allowed'));
        }
    },
    credentials: true
}));

// JSONパーサー（リクエストボディサイズ制限）
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静的ファイルの配信（public/uploads配下の画像を配信）
app.use('/api/uploads', express.static(path.join(__dirname, 'public/uploads')));

// リクエストログミドルウェア（開発環境のみ）
if (process.env.NODE_ENV !== 'production') {
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// APIルート（/apiプレフィックスで統一）
// より具体的なルートを先に登録する必要がある
app.use("/api/health", healthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);

// エラーハンドリングミドルウェア
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // 本番環境では詳細なエラー情報をログに記録
    if (process.env.NODE_ENV === 'production') {
        console.error('Error:', {
            message: err?.message,
            stack: err?.stack,
            path: req.path,
            method: req.method
        });
    } else {
        console.error('Error:', err);
    }

    // レスポンスは本番環境では詳細を非表示
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(err?.status || 500).json({
        error: 'Internal Server Error',
        ...(isProduction ? {} : { message: err?.message || 'Unknown error' })
    });
});

// 404ハンドラー
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});