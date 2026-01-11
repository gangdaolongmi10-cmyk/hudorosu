import { Request } from 'express';

/**
 * リクエストからIPアドレスを取得する
 * @param req Expressリクエストオブジェクト
 * @returns IPアドレス（取得できない場合はnull）
 */
export function getClientIp(req: Request): string | null {
    // X-Forwarded-Forヘッダーを確認（プロキシ経由の場合）
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        if (Array.isArray(forwardedFor)) {
            return forwardedFor[0].trim();
        } else {
            return forwardedFor.split(',')[0].trim();
        }
    }

    // X-Real-IPヘッダーを確認
    const realIp = req.headers['x-real-ip'];
    if (realIp) {
        if (Array.isArray(realIp)) {
            return realIp[0].trim();
        } else {
            return realIp.trim();
        }
    }

    // req.ipを確認
    if (req.ip) {
        return req.ip;
    }

    // req.connection.remoteAddressを確認
    if (req.connection && req.connection.remoteAddress) {
        return req.connection.remoteAddress;
    }

    return null;
}

/**
 * IPアドレスが許可リストに含まれているかチェック
 * @param ipAddress チェックするIPアドレス
 * @param allowedIps 許可されたIPアドレスの配列
 * @returns 許可されている場合はtrue
 */
export function isIpAllowed(ipAddress: string | null, allowedIps: string[]): boolean {
    if (!ipAddress) {
        return false;
    }

    // 許可リストが空の場合は全て許可
    if (allowedIps.length === 0) {
        return true;
    }

    // 完全一致またはCIDR表記のチェック
    for (const allowedIp of allowedIps) {
        if (allowedIp === ipAddress) {
            return true;
        }

        // CIDR表記のチェック（例: 192.168.1.0/24）
        if (allowedIp.includes('/')) {
            if (isIpInCidr(ipAddress, allowedIp)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * IPアドレスがCIDR範囲内かチェック
 * @param ip IPアドレス
 * @param cidr CIDR表記（例: 192.168.1.0/24）
 * @returns 範囲内の場合はtrue
 */
function isIpInCidr(ip: string, cidr: string): boolean {
    const [network, prefixLength] = cidr.split('/');
    const prefix = parseInt(prefixLength, 10);

    const ipNum = ipToNumber(ip);
    const networkNum = ipToNumber(network);
    const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;

    return (ipNum & mask) === (networkNum & mask);
}

/**
 * IPアドレスを数値に変換
 * @param ip IPアドレス
 * @returns 数値
 */
function ipToNumber(ip: string): number {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}
