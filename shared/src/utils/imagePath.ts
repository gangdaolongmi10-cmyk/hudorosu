/**
 * 画像パス構築のユーティリティ（共通）
 */

/**
 * アップロードされた画像のフルURLを構築する
 * @param relativePath バックエンドから返される相対パス（例: '/api/uploads/filename.jpg'）
 * @param baseUrl APIのベースURL（例: 'http://localhost:3000'）
 * @returns フルURL（例: 'http://localhost:3000/api/uploads/filename.jpg'）
 */
export function buildImageUrl(relativePath: string | null | undefined, baseUrl: string = ''): string {
    // 相対パスが空の場合は空文字を返す
    if (!relativePath) {
        return '';
    }

    // 既にフルURLの場合はそのまま返す
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('data:')) {
        return relativePath;
    }

    // baseUrlが空の場合は相対パスをそのまま返す
    if (!baseUrl) {
        return relativePath;
    }

    // baseUrlの末尾のスラッシュを削除
    const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
    
    // 相対パスの先頭のスラッシュを削除（既にbaseUrlに含まれている場合）
    const normalizedPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    
    return `${normalizedBaseUrl}${normalizedPath}`;
}

/**
 * アップロードされた画像の相対パスからフルURLを構築する（バックエンド用）
 * バックエンドから返される相対パス（例: '/api/uploads/filename.jpg'）を受け取り、
 * リクエストのホスト情報からフルURLを構築する
 * @param relativePath 相対パス（例: '/api/uploads/filename.jpg'）
 * @param req Expressのリクエストオブジェクト（オプション）
 * @returns フルURL
 */
export function buildImageUrlFromRequest(
    relativePath: string | null | undefined,
    protocol?: string,
    host?: string
): string {
    if (!relativePath) {
        return '';
    }

    // 既にフルURLの場合はそのまま返す
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('data:')) {
        return relativePath;
    }

    // プロトコルとホストが提供されていない場合は相対パスをそのまま返す
    if (!protocol || !host) {
        return relativePath;
    }

    return `${protocol}://${host}${relativePath}`;
}
