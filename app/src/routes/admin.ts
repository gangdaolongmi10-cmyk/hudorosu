import { Router, Request, Response } from "express";
import { loginController } from "../controllers/admin/loginController";
import { categoriesController } from "../controllers/admin/categoriesController";
import { usersController } from "../controllers/admin/usersController";
import { foodsController } from "../controllers/admin/foodsController";
import { statsController } from "../controllers/admin/statsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// 認証不要のルート
router.post("/login", loginController);
router.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "admin ok" });
});

// 認証が必要なルート（ミドルウェアを適用）
router.get("/categories/list", authMiddleware, categoriesController);
router.get("/users/list", authMiddleware, usersController);
router.get("/foods/list", authMiddleware, foodsController);
router.get("/stats", authMiddleware, statsController);

export default router;
