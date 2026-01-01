import { Router, Request, Response } from "express";
import { loginController } from "../controllers/admin/loginController";
import { categoriesController } from "../controllers/admin/categoriesController";
import { usersController, createUserController, updateUserController, deleteUserController } from "../controllers/admin/usersController";
import { foodsController } from "../controllers/admin/foodsController";
import { statsController } from "../controllers/admin/statsController";
import { getCurrentUserController, updateUserController as updateCurrentUserController, changePasswordController } from "../controllers/admin/settingsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

// 認証不要のルート
router.post("/login", loginController);
router.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "admin ok" });
});

// 認証が必要なルート（ミドルウェアを適用）
router.get("/categories/list", authMiddleware, categoriesController);
router.get("/users/list", authMiddleware, usersController);
router.post("/users/create", authMiddleware, adminMiddleware, createUserController);
router.put("/users/:id", authMiddleware, adminMiddleware, updateUserController);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUserController);
router.get("/foods/list", authMiddleware, foodsController);
router.get("/stats", authMiddleware, statsController);

// 設定関連のルート
router.get("/settings/me", authMiddleware, getCurrentUserController);
router.put("/settings/me", authMiddleware, updateCurrentUserController);
router.put("/settings/password", authMiddleware, changePasswordController);

export default router;
