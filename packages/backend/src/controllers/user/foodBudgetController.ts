import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { userRepository } from '../../repositories/userRepository';
import { transactionRepository } from '../../repositories/transactionRepository';
import { transactionCategoryRepository } from '../../repositories/transactionCategoryRepository';

/**
 * 目標食費を取得
 */
export const getDailyFoodBudgetController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const user = await userRepository.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                error: 'ユーザーが見つかりません' 
            });
        }

        res.status(200).json({ 
            daily_food_budget: user.daily_food_budget 
        });
    } catch (error) {
        console.error('Get daily food budget error:', error);
        res.status(500).json({ error: '目標食費の取得中にエラーが発生しました' });
    }
};

/**
 * 目標食費を設定
 */
export const setDailyFoodBudgetController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { daily_food_budget } = req.body;
        console.log('Received daily_food_budget:', daily_food_budget, 'type:', typeof daily_food_budget);

        // 型を統一して数値に変換
        let budgetValue: number | null = null;
        
        if (daily_food_budget !== null && daily_food_budget !== undefined) {
            // 既に数値の場合はそのまま使用、文字列の場合はparseIntで変換
            if (typeof daily_food_budget === 'number') {
                budgetValue = daily_food_budget;
            } else if (typeof daily_food_budget === 'string') {
                budgetValue = parseInt(daily_food_budget, 10);
            } else {
                console.error('Invalid daily_food_budget type:', typeof daily_food_budget);
                return res.status(400).json({ 
                    error: '有効な金額を入力してください' 
                });
            }
            
            // バリデーション
            if (isNaN(budgetValue) || budgetValue < 0) {
                console.error('Invalid budget value:', budgetValue);
                return res.status(400).json({ 
                    error: '有効な金額を入力してください' 
                });
            }
        }

        console.log('Updating budget to:', budgetValue);
        const user = await userRepository.updateDailyFoodBudget(userId, budgetValue);
        console.log('Updated user:', user);

        res.status(200).json({ 
            daily_food_budget: user.daily_food_budget,
            message: '目標食費を設定しました'
        });
    } catch (error: any) {
        console.error('Set daily food budget error:', error);
        if (error.message === 'ユーザーが見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ error: '目標食費の設定中にエラーが発生しました' });
    }
};

/**
 * 今日の食費合計と残り金額を取得
 */
export const getTodayFoodExpenseController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        // ユーザーの目標食費を取得
        const user = await userRepository.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                error: 'ユーザーが見つかりません' 
            });
        }

        // 食費カテゴリを取得
        const categories = await transactionCategoryRepository.findByUserId(userId);
        const foodCategory = categories.find((cat: any) => cat.name === '食費' && cat.user_id === null);
        
        if (!foodCategory) {
            return res.status(200).json({
                daily_food_budget: user.daily_food_budget,
                today_expense: 0,
                remaining: user.daily_food_budget || null,
                over_budget: 0
            });
        }

        // 今日の日付を取得
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD形式

        // 今日の食費カテゴリの取引を取得
        const transactions = await transactionRepository.findByUserId(userId, {
            category_id: foodCategory.id,
            start_date: todayString,
            end_date: todayString
        });

        // 今日の食費合計を計算
        let todayExpense = 0;
        transactions.forEach((transaction: any) => {
            if (transaction.type === 'expense') {
                todayExpense += parseFloat(transaction.amount) || 0;
            }
        });

        const dailyFoodBudget = user.daily_food_budget || 0;
        const remaining = dailyFoodBudget > 0 ? dailyFoodBudget - todayExpense : null;
        const overBudget = dailyFoodBudget > 0 && todayExpense > dailyFoodBudget 
            ? todayExpense - dailyFoodBudget 
            : 0;

        res.status(200).json({
            daily_food_budget: user.daily_food_budget,
            today_expense: todayExpense,
            remaining: remaining,
            over_budget: overBudget
        });
    } catch (error) {
        console.error('Get today food expense error:', error);
        res.status(500).json({ error: '今日の食費情報の取得中にエラーが発生しました' });
    }
};

