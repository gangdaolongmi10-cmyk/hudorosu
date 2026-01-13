# Netlifyデプロイガイド

## デプロイ設定

### 1. Netlifyダッシュボードでの設定

#### 基本設定

1. [Netlify](https://www.netlify.com) にログイン
2. 「Add new site」→「Import an existing project」をクリック
3. GitHubリポジトリを選択

#### プロジェクト設定

以下の設定を行ってください：

| 項目 | 値 |
|------|-----|
| **Base directory** | **空（設定しない）** |
| **Build command** | `cd packages/lp && npm run build` |
| **Publish directory** | `packages/lp/.next` |
| **Functions directory** | **空（設定しない）** |

**注意**: NetlifyはNext.jsを自動検出しますが、上記の設定を明示的に行うことを推奨します。

#### 環境変数の設定

**Environment variables**セクションで以下を設定：

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `REVALIDATE_SECRET` | `openssl rand -base64 32`で生成 | ISR再検証トークン |
| `NEXT_PUBLIC_BASE_URL` | `https://www.hudorosu.com` | サイトのベースURL |

**重要**: `NEXT_PUBLIC_BASE_URL`は、デプロイ後に実際のURLに更新してください。

### 2. Next.jsプラグインの設定

Next.js 14のApp RouterをNetlifyで使用するため、`@netlify/plugin-nextjs`プラグインが必要です。

`netlify.toml`に以下の設定が含まれています：

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

このプラグインにより、Next.jsのSSR/ISR機能が正しく動作します。

**重要**: `package.json`の`devDependencies`に`@netlify/plugin-nextjs`が含まれていることを確認してください。

### 3. デプロイ後の確認

デプロイが完了したら、以下を確認してください：

1. **トップページ**: `https://your-site.netlify.app/`
2. **管理画面**: `https://your-site.netlify.app/admin/login`
3. **ブログ記事**: `https://your-site.netlify.app/blog/[slug]`
4. **sitemap.xml**: `https://your-site.netlify.app/sitemap.xml`
5. **robots.txt**: `https://your-site.netlify.app/robots.txt`

### 4. カスタムドメインの設定

1. Netlifyダッシュボードでプロジェクトを開く
2. 「Domain settings」をクリック
3. 「Add custom domain」をクリック
4. カスタムドメイン（例: `www.hudorosu.com`）を入力
5. DNS設定を完了

カスタムドメインを設定した場合、`NEXT_PUBLIC_BASE_URL`を更新してください。

### 5. リダイレクトの設定（オプション）

Netlifyのデフォルトドメイン（`*.netlify.app`）からカスタムドメインへのリダイレクトを設定する場合：

`netlify.toml`に以下を追加：

```toml
[[redirects]]
  from = "https://your-site.netlify.app/*"
  to = "https://www.hudorosu.com/:splat"
  status = 301
  force = true
```

## トラブルシューティング

### ビルドエラー

- **エラー**: `Cannot find module '@hudorosu/shared'`
  - **解決策**: ルートディレクトリで`npm install`を実行してからデプロイ

- **エラー**: `TypeScript errors`
  - **解決策**: ローカルで`npm run build`を実行してエラーを確認

### 環境変数エラー

- **エラー**: `REVALIDATE_SECRET is not set`
  - **解決策**: Netlifyダッシュボードで環境変数を設定

### ISRが動作しない

- **確認事項**:
  1. `REVALIDATE_SECRET`が正しく設定されているか
  2. `/api/revalidate`エンドポイントが正しく動作しているか
  3. ブログ記事作成時に再検証APIが呼び出されているか

### リダイレクトが動作しない

- **確認事項**:
  1. `netlify.toml`が正しく設定されているか
  2. デプロイ後に設定が反映されているか
  3. ブラウザのキャッシュをクリア

### Page not foundエラー

- **原因**: Next.js 14のApp RouterをNetlifyで使用する場合、`@netlify/plugin-nextjs`プラグインが必要です
- **解決策**:
  1. `package.json`の`devDependencies`に`@netlify/plugin-nextjs`が含まれているか確認
  2. `netlify.toml`に以下の設定が含まれているか確認：
     ```toml
     [[plugins]]
       package = "@netlify/plugin-nextjs"
     ```
  3. 変更をコミット・プッシュして再デプロイ
  4. Netlifyダッシュボードで「Site configuration」→「Build & deploy」→「Plugins」を確認し、プラグインが有効になっているか確認

## Vercelからの移行

### 主な変更点

1. **設定ファイル**: `vercel.json` → `netlify.toml`
2. **リダイレクト設定**: Next.jsの`redirects()` → `netlify.toml`の`[[redirects]]`
3. **環境変数**: Vercelダッシュボード → Netlifyダッシュボード
4. **ドメイン設定**: Vercelダッシュボード → Netlifyダッシュボード

### 移行手順

1. `netlify.toml`を作成（既に作成済み）
2. `next.config.js`からVercel固有の設定を削除（既に削除済み）
3. `robots.ts`からVercel固有の設定を削除（既に削除済み）
4. Netlifyダッシュボードでプロジェクトを作成
5. 環境変数を設定
6. カスタムドメインを設定
7. デプロイを確認

## 参考リンク

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
