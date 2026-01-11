import apiClient from '../config/api';

export interface LoginLog {
  id: number;
  user_id: number;
  login_method: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface LoginLogsResponse {
  logs: LoginLog[];
  totalCount: number;
  limit: number;
  offset: number;
}

/**
 * ログインログ一覧を取得する
 * @param limit 取得件数の上限（オプション）
 * @param offset オフセット（オプション）
 * @param userId ユーザーIDでフィルタ（オプション）
 * @returns ログインログの配列
 */
export const fetchLoginLogs = async (
  limit?: number,
  offset?: number,
  userId?: number
): Promise<LoginLogsResponse> => {
  const params: any = {};
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;
  if (userId !== undefined) params.user_id = userId;

  const response = await apiClient.get<LoginLogsResponse>('/admin/login-logs/list', { params });
  return response.data;
};

