# 共通設定ファイルの使い方

このプロジェクトでは、`shared/config/` ディレクトリに共通の設定ファイルを配置しています。

## 構成

```
shared/
├── config/
│   ├── api.ts      # API設定（URL、タイムアウトなど）
│   └── index.ts    # エクスポート
└── index.ts        # 共通モジュールのエクスポート
```

## 使用方法

### 1. モバイルアプリ（React Native）

```typescript
import { getApiBaseUrl, API_TIMEOUT } from '@shared/config';

// API URLを取得
const apiUrl = getApiBaseUrl();

// タイムアウト設定を使用
const timeout = API_TIMEOUT;
```

### 2. フロントエンド（React）

```typescript
import { getApiBaseUrl, API_TIMEOUT } from '@shared/config';

// API URLを取得
const apiUrl = getApiBaseUrl();

// タイムアウト設定を使用
const timeout = API_TIMEOUT;
```

### 3. バックエンド（Express）

```typescript
import { getAllowedOrigins } from '@shared/config';

// CORS許可オリジンを取得
const origins = getAllowedOrigins();
```

## 環境変数

共通設定は以下の環境変数でカスタマイズできます：

- `NODE_ENV`: 環境タイプ（development/production/test）
- `DEV_API_URL`: 開発環境のAPI URL（デフォルト: `http://localhost:3000`）
- `PROD_API_URL`: 本番環境のAPI URL（デフォルト: `https://your-production-api.com`）
- `FRONTEND_URL`: 本番環境のフロントエンドURL（カンマ区切り）

## 設定の追加

新しい共通設定を追加する場合：

1. `shared/config/` に新しいファイルを作成
2. `shared/config/index.ts` でエクスポート
3. `shared/index.ts` でエクスポート（既に設定済み）

例：

```typescript
// shared/config/app.ts
export const APP_NAME = 'キッチン日和';
export const APP_VERSION = '1.0.0';
```

## 注意事項

- モバイルアプリでは `process.env` が制限される場合があるため、Expo Constantsを使用
- 環境変数は各アプリの実行環境に応じて適切に設定してください
