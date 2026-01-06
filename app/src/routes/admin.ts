import { Router, Request, Response } from "express";
import { loginController } from "../controllers/admin/loginController";
import { categoriesController, createCategoryController, updateCategoryController, deleteCategoryController } from "../controllers/admin/categoriesController";
import { usersController, createUserController, updateUserController, deleteUserController } from "../controllers/admin/usersController";
import { foodsController, getFoodController, createFoodController, updateFoodController, deleteFoodController, getFoodsByCategoryController } from "../controllers/admin/foodsController";
import { allergensController, createAllergenController, updateAllergenController, deleteAllergenController } from "../controllers/admin/allergensController";
import { recipesController, getRecipeController, createRecipeController, updateRecipeController, deleteRecipeController, getRecipeAllergensController } from "../controllers/admin/recipesController";
import { faqsController, createFaqController, updateFaqController, deleteFaqController } from "../controllers/admin/faqsController";
import { loginLogsController } from "../controllers/admin/loginLogsController";
import { statsController } from "../controllers/admin/statsController";
import { stocksController, stocksStatsController } from "../controllers/admin/stocksController";
import { getCurrentUserController, updateUserController as updateCurrentUserController, changePasswordController } from "../controllers/admin/settingsController";
import { getAppNameController, getSystemSettingsController, updateSystemSettingsController } from "../controllers/admin/systemSettingsController";
import { uploadAvatarController } from "../controllers/admin/uploadController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { upload } from "../config/multer";

const router = Router();

// 認証不要のルート
router.post("/login", loginController);
router.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "admin ok" });
});

// 認証が必要なルート（ミドルウェアを適用）
router.get("/categories/list", authMiddleware, categoriesController);
router.post("/categories/create", authMiddleware, adminMiddleware, createCategoryController);
router.put("/categories/:id", authMiddleware, adminMiddleware, updateCategoryController);
router.delete("/categories/:id", authMiddleware, adminMiddleware, deleteCategoryController);
router.get("/users/list", authMiddleware, usersController);
router.post("/users/create", authMiddleware, adminMiddleware, createUserController);
router.put("/users/:id", authMiddleware, adminMiddleware, updateUserController);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUserController);
router.get("/foods/list", authMiddleware, foodsController);
router.get("/foods/category/:categoryId", authMiddleware, getFoodsByCategoryController);
router.get("/foods/:id", authMiddleware, getFoodController);
router.post("/foods/create", authMiddleware, adminMiddleware, createFoodController);
router.put("/foods/:id", authMiddleware, adminMiddleware, updateFoodController);
router.delete("/foods/:id", authMiddleware, adminMiddleware, deleteFoodController);
router.get("/recipes/list", authMiddleware, recipesController);
router.get("/recipes/:id", authMiddleware, getRecipeController);
router.post("/recipes/create", authMiddleware, adminMiddleware, createRecipeController);
router.put("/recipes/:id", authMiddleware, adminMiddleware, updateRecipeController);
router.delete("/recipes/:id", authMiddleware, adminMiddleware, deleteRecipeController);
router.get("/recipes/:id/allergens", authMiddleware, getRecipeAllergensController);
router.get("/allergens/list", authMiddleware, allergensController);
router.post("/allergens/create", authMiddleware, adminMiddleware, createAllergenController);
router.put("/allergens/:id", authMiddleware, adminMiddleware, updateAllergenController);
router.delete("/allergens/:id", authMiddleware, adminMiddleware, deleteAllergenController);
router.get("/faqs/list", authMiddleware, faqsController);
router.post("/faqs/create", authMiddleware, adminMiddleware, createFaqController);
router.put("/faqs/:id", authMiddleware, adminMiddleware, updateFaqController);
router.delete("/faqs/:id", authMiddleware, adminMiddleware, deleteFaqController);
router.get("/login-logs/list", authMiddleware, loginLogsController);
router.get("/stats", authMiddleware, statsController);
router.get("/stocks/list", authMiddleware, adminMiddleware, stocksController);
router.get("/stocks/stats", authMiddleware, adminMiddleware, stocksStatsController);

// 設定関連のルート
router.get("/settings/me", authMiddleware, getCurrentUserController);
router.put("/settings/me", authMiddleware, updateCurrentUserController);
router.put("/settings/password", authMiddleware, changePasswordController);
router.get("/settings/app-name", authMiddleware, getAppNameController);
router.get("/settings/system", authMiddleware, adminMiddleware, getSystemSettingsController);
router.put("/settings/system", authMiddleware, adminMiddleware, updateSystemSettingsController);

// 画像アップロード
router.post("/upload/avatar", authMiddleware, upload.single('avatar'), uploadAvatarController);

export default router;
