import { Request, Response, NextFunction } from 'express';
import db from '../../models';
import { getClientIp, isIpAllowed } from '../utils/ipHelper';

/**
 * IPアドレス制限ミドルウェア
 * 許可されたIPアドレスのみアクセス可能
 */
export const ipWhitelistMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // 許可されたIPアドレスのリストを取得
        const allowedIps = await db.allowed_ips.findAll({
            where: { is_active: true },
            attributes: ['ip_address']
        });

        const allowedIpList = allowedIps.map(ip => ip.ip_address);

        // IPアドレス制限が有効な場合のみチェック
        // 許可リストが空の場合は全て許可（設定されていない場合）
        if (allowedIpList.length > 0) {
            const clientIp = getClientIp(req);

            if (!isIpAllowed(clientIp, allowedIpList)) {
                console.warn(`IP address blocked: ${clientIp}`);
                return res.status(403).json({
                    error: 'アクセスが拒否されました。許可されたIPアドレスからのみアクセス可能です。'
                });
            }
        }

        next();
    } catch (error) {
        console.error('IP whitelist check error:', error);
        // エラーが発生した場合はアクセスを許可（フェイルセーフ）
        next();
    }
};
