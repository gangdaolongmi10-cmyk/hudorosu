import db from '../../models';

// ログイン試行回数の制限
const MAX_LOGIN_ATTEMPTS = 5;
// アカウントロック時間（分）
const LOCK_DURATION_MINUTES = 30;

/**
 * アカウントがロックされているかチェック
 * @param user ユーザーオブジェクト
 * @returns ロックされている場合はtrue
 */
export function isAccountLocked(user: any): boolean {
    if (!user.locked_until) {
        return false;
    }

    const lockUntil = new Date(user.locked_until);
    const now = new Date();

    // ロック期限が過ぎている場合はロック解除
    if (lockUntil <= now) {
        return false;
    }

    return true;
}

/**
 * ログイン失敗回数を増やす
 * @param userId ユーザーID
 * @returns アカウントがロックされた場合はtrue
 */
export async function incrementFailedLoginAttempts(userId: number): Promise<boolean> {
    const user = await db.users.findByPk(userId);
    if (!user) {
        return false;
    }

    const failedAttempts = (user.failed_login_attempts || 0) + 1;

    // 最大試行回数に達した場合、アカウントをロック
    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + LOCK_DURATION_MINUTES);

        await db.users.update(
            {
                failed_login_attempts: failedAttempts,
                locked_until: lockUntil
            },
            { where: { id: userId } }
        );

        return true;
    } else {
        await db.users.update(
            { failed_login_attempts: failedAttempts },
            { where: { id: userId } }
        );
        return false;
    }
}

/**
 * ログイン成功時に失敗回数をリセット
 * @param userId ユーザーID
 */
export async function resetFailedLoginAttempts(userId: number): Promise<void> {
    await db.users.update(
        {
            failed_login_attempts: 0,
            locked_until: null
        },
        { where: { id: userId } }
    );
}

/**
 * ロック解除までの残り時間を取得（分）
 * @param user ユーザーオブジェクト
 * @returns 残り時間（分）、ロックされていない場合は0
 */
export function getRemainingLockTime(user: any): number {
    if (!user.locked_until) {
        return 0;
    }

    const lockUntil = new Date(user.locked_until);
    const now = new Date();

    if (lockUntil <= now) {
        return 0;
    }

    const diffMs = lockUntil.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60)); // 分に変換
}
