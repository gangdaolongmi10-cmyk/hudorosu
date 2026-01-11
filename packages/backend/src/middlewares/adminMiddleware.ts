import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { ROLE } from "../constants/role";

/**
 * 管理者権限チェックミドルウェア
 * 管理者のみアクセス可能
 */
export const adminMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ 
            error: "認証が必要です" 
        });
    }

    if (req.user.role !== ROLE.ADMIN) {
        return res.status(403).json({ 
            error: "管理者権限が必要です" 
        });
    }

    next();
};

