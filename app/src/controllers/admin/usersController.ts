import { Request, Response } from 'express';
import { userRepository } from '../../repositories/userRepository';

export const usersController = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('User Fetch Error:', error);
        res.status(500).json({ error: 'ユーザーの取得中にエラーが発生しました' });
    }
};

