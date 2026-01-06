import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMasterFoodsController, getMasterFoodsByCategoryController, createUserFoodController } from "../controllers/user/foodsController";
import { categoriesController } from "../controllers/admin/categoriesController";
import { getStocksController, getStockByIdController, createStockController, updateStockController, deleteStockController } from "../controllers/user/stocksController";
import { getUserStocksController } from "../controllers/user/stocksManagementController";
import { getRecommendedRecipesController, getRecipesController, getRecipeByIdController } from "../controllers/user/recipesController";
import { getFaqsController } from "../controllers/user/faqsController";

const router = Router();

// 認証が必要なルート
router.get("/foods/master", authMiddleware, getMasterFoodsController);
router.get("/foods/master/category/:categoryId", authMiddleware, getMasterFoodsByCategoryController);
router.post("/foods/create", authMiddleware, createUserFoodController);
router.get("/categories/list", authMiddleware, categoriesController);

// 在庫管理ルート
router.get("/stocks", authMiddleware, getStocksController);
router.get("/stocks/:id", authMiddleware, getStockByIdController);
router.post("/stocks", authMiddleware, createStockController);
router.put("/stocks/:id", authMiddleware, updateStockController);
router.delete("/stocks/:id", authMiddleware, deleteStockController);
// 在庫管理画面用（一般ユーザー向け）
router.get("/stocks/management", authMiddleware, getUserStocksController);

// レシピルート
router.get("/recipes/recommended", authMiddleware, getRecommendedRecipesController);
router.get("/recipes", authMiddleware, getRecipesController);
router.get("/recipes/:id", authMiddleware, getRecipeByIdController);

// FAQルート
router.get("/faqs", authMiddleware, getFaqsController);

export default router;
