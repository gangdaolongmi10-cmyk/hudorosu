import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMasterFoodsController, getMasterFoodsByCategoryController, createUserFoodController } from "../controllers/user/foodsController";
import { categoriesController } from "../controllers/admin/categoriesController";
import { getStocksController, getStockByIdController, createStockController, updateStockController, deleteStockController } from "../controllers/user/stocksController";
import { getUserStocksController } from "../controllers/user/stocksManagementController";
import { getRecommendedRecipesController, getRecommendedRecipesByBudgetController, getRecipesController, getRecipeByIdController, deleteRecipeController } from "../controllers/user/recipesController";
import { getFaqsController } from "../controllers/user/faqsController";
import { 
    getTransactionsController, 
    getTransactionByIdController, 
    createTransactionController, 
    updateTransactionController, 
    deleteTransactionController,
    getTransactionStatsController
} from "../controllers/user/transactionsController";
import {
    getTransactionCategoriesController,
    getTransactionCategoryByIdController,
    createTransactionCategoryController,
    updateTransactionCategoryController,
    deleteTransactionCategoryController
} from "../controllers/user/transactionCategoriesController";
import {
    getDailyFoodBudgetController,
    setDailyFoodBudgetController,
    getTodayFoodExpenseController
} from "../controllers/user/foodBudgetController";

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
router.get("/recipes/recommended-by-budget", authMiddleware, getRecommendedRecipesByBudgetController);
router.get("/recipes", authMiddleware, getRecipesController);
router.get("/recipes/:id", authMiddleware, getRecipeByIdController);
router.delete("/recipes/:id", authMiddleware, deleteRecipeController);

// 買い物リスト
import {
    getShoppingListController,
    createShoppingListItemController,
    updateShoppingListItemController,
    deleteShoppingListItemController,
    deletePurchasedItemsController,
    createShoppingListFromRecipeController
} from '../controllers/user/shoppingListController';

router.get("/shopping-list", authMiddleware, getShoppingListController);
router.post("/shopping-list", authMiddleware, createShoppingListItemController);
router.put("/shopping-list/:id", authMiddleware, updateShoppingListItemController);
router.delete("/shopping-list/:id", authMiddleware, deleteShoppingListItemController);
router.delete("/shopping-list/purchased", authMiddleware, deletePurchasedItemsController);
router.post("/shopping-list/from-recipe", authMiddleware, createShoppingListFromRecipeController);

// お気に入り
import {
    getFavoritesController,
    addFavoriteController,
    removeFavoriteController,
    toggleFavoriteController,
    getFavoriteStatusController
} from '../controllers/user/favoritesController';

router.get("/favorites", authMiddleware, getFavoritesController);
router.post("/favorites", authMiddleware, addFavoriteController);
router.delete("/favorites/:id", authMiddleware, removeFavoriteController);
router.post("/favorites/toggle", authMiddleware, toggleFavoriteController);
router.get("/favorites/status", authMiddleware, getFavoriteStatusController);

// FAQルート
router.get("/faqs", authMiddleware, getFaqsController);

// 家計簿カテゴリルート
router.get("/transaction-categories", authMiddleware, getTransactionCategoriesController);
router.get("/transaction-categories/:id", authMiddleware, getTransactionCategoryByIdController);
router.post("/transaction-categories", authMiddleware, createTransactionCategoryController);
router.put("/transaction-categories/:id", authMiddleware, updateTransactionCategoryController);
router.delete("/transaction-categories/:id", authMiddleware, deleteTransactionCategoryController);

// 家計簿記録ルート
router.get("/transactions", authMiddleware, getTransactionsController);
router.get("/transactions/stats", authMiddleware, getTransactionStatsController);
router.get("/transactions/:id", authMiddleware, getTransactionByIdController);
router.post("/transactions", authMiddleware, createTransactionController);
router.put("/transactions/:id", authMiddleware, updateTransactionController);
router.delete("/transactions/:id", authMiddleware, deleteTransactionController);

// 目標食費ルート
router.get("/food-budget", authMiddleware, getDailyFoodBudgetController);
router.put("/food-budget", authMiddleware, setDailyFoodBudgetController);
router.get("/food-budget/today", authMiddleware, getTodayFoodExpenseController);

export default router;
