import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { userRepository } from '../../repositories/userRepository';
import { DEFAULT_ROLE, ROLE } from '../../constants/role';
// @ts-ignore
import db from '../../../models';

export const usersController = async (req: AuthRequest, res: Response) => {
    try {
        const users = await userRepository.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('User Fetch Error:', error);
        res.status(500).json({ error: 'ユーザーの取得中にエラーが発生しました' });
    }
};

/**
 * 新規ユーザーを作成
 */
export const createUserController = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password, name, role } = req.body;

        // バリデーション
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'メールアドレスとパスワードを入力してください' 
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ 
                error: '有効なメールアドレスを入力してください' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'パスワードは6文字以上である必要があります' 
            });
        }

        // ロールのバリデーション
        const validRole = role === ROLE.ADMIN || role === ROLE.USER || !role;
        if (role && !validRole) {
            return res.status(400).json({ 
                error: '無効なロールです' 
            });
        }

        // メールアドレスの重複チェック
        const existingUser = await db.users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ 
                error: 'このメールアドレスは既に使用されています' 
            });
        }

        // トランザクションでユーザーと認証情報を作成
        const transaction = await db.sequelize.transaction();

        try {
            // ユーザーの作成
            const newUser = await db.users.create({
                email,
                name: name || null,
                role: role || DEFAULT_ROLE,
            }, { transaction });

            // パスワードのハッシュ化
            const passwordHash = await bcrypt.hash(password, 10);

            // ローカル認証情報の作成
            await db.local_auth.create({
                user_id: newUser.id,
                password_hash: passwordHash,
            }, { transaction });

            await transaction.commit();

            // 作成されたユーザー情報を返す
            const createdUser = await db.users.findByPk(newUser.id, {
                attributes: ['id', 'email', 'name', 'role', 'avatar_url', 'created_at', 'updated_at'],
            });

            res.status(201).json(createdUser);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error: any) {
        console.error('Create user error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                error: 'このメールアドレスは既に使用されています' 
            });
        }
        res.status(500).json({ 
            error: 'ユーザーの作成中にエラーが発生しました' 
        });
    }
};

/**
 * ユーザー情報を更新（管理者のみ）
 */
export const updateUserController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { email, name, role, password, avatar_url } = req.body;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: 'ユーザーIDが必要です' 
            });
        }

        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ 
                error: '無効なユーザーIDです' 
            });
        }

        // ユーザーの存在確認
        const user = await db.users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ 
                error: 'ユーザーが見つかりません' 
            });
        }

        // メールアドレスのバリデーション
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ 
                error: '有効なメールアドレスを入力してください' 
            });
        }

        // メールアドレスの重複チェック
        if (email && email !== user.email) {
            const existingUser = await db.users.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ 
                    error: 'このメールアドレスは既に使用されています' 
                });
            }
        }

        // ロールのバリデーション
        if (role && role !== ROLE.ADMIN && role !== ROLE.USER) {
            return res.status(400).json({ 
                error: '無効なロールです' 
            });
        }

        // パスワードのバリデーション
        if (password && password.length < 6) {
            return res.status(400).json({ 
                error: 'パスワードは6文字以上である必要があります' 
            });
        }

        // トランザクションで更新
        const transaction = await db.sequelize.transaction();

        try {
            // ユーザー情報の更新
            const updateData: any = {};
            if (email !== undefined) updateData.email = email;
            if (name !== undefined) updateData.name = name;
            if (role !== undefined) updateData.role = role;
            if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

            await user.update(updateData, { transaction });

            // パスワードの更新（指定されている場合）
            if (password) {
                const passwordHash = await bcrypt.hash(password, 10);
                const localAuth = await db.local_auth.findOne({
                    where: { user_id: userId },
                    transaction
                });

                if (localAuth) {
                    await localAuth.update({ password_hash: passwordHash }, { transaction });
                } else {
                    // ローカル認証情報が存在しない場合は作成
                    await db.local_auth.create({
                        user_id: userId,
                        password_hash: passwordHash,
                    }, { transaction });
                }
            }

            await transaction.commit();

            // 更新されたユーザー情報を返す
            const updatedUser = await db.users.findByPk(userId, {
                attributes: ['id', 'email', 'name', 'role', 'avatar_url', 'created_at', 'updated_at'],
            });

            res.status(200).json(updatedUser);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error: any) {
        console.error('Update user error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                error: 'このメールアドレスは既に使用されています' 
            });
        }
        res.status(500).json({ 
            error: 'ユーザーの更新中にエラーが発生しました' 
        });
    }
};

/**
 * ユーザーを削除（物理削除、管理者のみ）
 */
export const deleteUserController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: 'ユーザーIDが必要です' 
            });
        }

        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ 
                error: '無効なユーザーIDです' 
            });
        }

        // 自分自身を削除しようとしている場合はエラー
        if (req.user && req.user.id === userId) {
            return res.status(400).json({ 
                error: '自分自身を削除することはできません' 
            });
        }

        // ユーザーの存在確認
        const user = await db.users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ 
                error: 'ユーザーが見つかりません' 
            });
        }

        // トランザクションで削除
        const transaction = await db.sequelize.transaction();

        try {
            // ローカル認証情報を削除
            await db.local_auth.destroy({
                where: { user_id: userId },
                transaction
            });

            // ユーザーを削除
            await user.destroy({ transaction });

            await transaction.commit();

            res.status(200).json({ 
                message: 'ユーザーが正常に削除されました' 
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ 
            error: 'ユーザーの削除中にエラーが発生しました' 
        });
    }
};

