import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { UPLOAD_IMAGE_BASE_PATH } from "@shared/constants/images";

/**
 * 画像をアップロード
 */
export const uploadAvatarController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "画像ファイルがアップロードされていません" });
        }

        // アップロードされたファイルのURLを返す（共通の定数を使用）
        const fileUrl = `${UPLOAD_IMAGE_BASE_PATH}/${req.file.filename}`;
        
        res.status(200).json({
            message: "画像が正常にアップロードされました",
            url: fileUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error("Upload avatar error:", error);
        res.status(500).json({ error: "画像のアップロード中にエラーが発生しました" });
    }
};

