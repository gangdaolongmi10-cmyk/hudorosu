import multer from 'multer';
import path from 'path';
import fs from 'fs';

// public/uploadsディレクトリが存在しない場合は作成
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ストレージ設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // ファイル名を一意にするため、タイムスタンプとランダム文字列を追加
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, `${basename}-${uniqueSuffix}${ext}`);
    }
});

// ファイルフィルター（画像ファイルのみ許可）
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // 画像ファイルのMIMEタイプをチェック
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('画像ファイルのみアップロード可能です'));
    }
};

// multer設定
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    }
});

// アップロードディレクトリのパスをエクスポート
export const UPLOAD_DIR = uploadDir;
