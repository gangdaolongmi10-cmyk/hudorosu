# Vercelデプロイガイド

## デプロイ設定

### 1. Vercelダッシュボードでの設定

#### 基本設定

1. [Vercel](https://vercel.com) にログイン
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリを選択

#### プロジェクト設定

以下の設定を行ってください：

| 項目 | 値 |
|------|-----|
| **Root Directory** | `packages/lp` |
| **Framework Preset** | `Next.js` |
| **Build Command** | `npm run build`（自動検出） |
| **Output Directory** | `.next`（自動検出） |
| **Install Command** | `npm install`（自動検出） |

#### 環境変数の設定

**Environment Variables**セクションで以下を設定：

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `REVALIDATE_SECRET` | `openssl rand -base64 32`で生成 | ISR再検証トークン |
| `NEXT_PUBLIC_BASE_URL` | `https://your-project.vercel.app` | サイトのベースURL |

**重要**: `NEXT_PUBLIC_BASE_URL`は、デプロイ後に実際のURLに更新してください。

### 2. デプロイ後の確認

デプロイが完了したら、以下を確認してください：

1. **トップページ**: `https://your-project.vercel.app/`
2. **管理画面**: `https://your-project.vercel.app/admin/login`
3. **ブログ記事**: `https://your-project.vercel.app/blog/[slug]`
4. **sitemap.xml**: `https://your-project.vercel.app/sitemap.xml`

### 3. カスタムドメインの設定（オプション）

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Domains」をクリック
3. カスタムドメインを追加
4. DNS設定を完了

カスタムドメインを設定した場合、`NEXT_PUBLIC_BASE_URL`を更新してください。

## トラブルシューティング

### ビルドエラー

- **エラー**: `Cannot find module '@hudorosu/shared'`
  - **解決策**: ルートディレクトリで`npm install`を実行してからデプロイ

- **エラー**: `TypeScript errors`
  - **解決策**: ローカルで`npm run build`を実行してエラーを確認

### 環境変数エラー

- **エラー**: `REVALIDATE_SECRET is not set`
  - **解決策**: Vercelダッシュボードで環境変数を設定

### ISRが動作しない

- **確認事項**:
  1. `REVALIDATE_SECRET`が正しく設定されているか
  2. `/api/revalidate`エンドポイントが正しく動作しているか
  3. ブログ記事作成時に再検証APIが呼び出されているか

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
