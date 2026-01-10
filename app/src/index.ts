import express, { Application } from "express";
import cors from "cors";
import path from "path";
import healthRoutes from "./routes/health";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import { getAllowedOrigins } from "@shared/config";

const app: Application = express();
const PORT: number = 3000;

// Trust proxy（リバースプロキシ経由の場合にIPアドレスを正しく取得するため）
app.set('trust proxy', true);

// CORS設定（共通設定から取得）
const allowedOrigins = getAllowedOrigins();

app.use(cors({
    origin: (origin, callback) => {
        // オリジンが未定義の場合（例: モバイルアプリ、Postmanなど）も許可
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy: Origin not allowed'));
        }
    },
    credentials: true
}));

// JSONパーサー
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの配信（public/uploads配下の画像を配信）
app.use('/api/uploads', express.static(path.join(__dirname, '../public/uploads')));

// リクエストログミドルウェア（デバッグ用）
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// APIルート（/apiプレフィックスで統一）
// より具体的なルートを先に登録する必要がある
app.use("/api/health", healthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);

// エラーハンドリングミドルウェア
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err?.message || 'Unknown error'
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