import express, { Application } from "express";
import cors from "cors";
import healthRoutes from "./routes/health";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";

const app: Application = express();
const PORT: number = 3000;

// CORS設定
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

// JSONパーサー
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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