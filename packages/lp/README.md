# LP（ランディングページ）

`index.html` のみで構成されたシンプルなランディングページ

## ファイル構成

```
packages/lp/
├── index.html      # メインHTMLファイル
├── vercel.json     # Vercel設定（オプション）
└── README.md       # このファイル
```

## ローカルで確認

```bash
# ブラウザで直接開く
open index.html

# または、ローカルサーバーを起動
python3 -m http.server 8000
# ブラウザで http://localhost:8000 にアクセス
```

## Vercelでのデプロイ

詳細は `DEPLOY.md` を参照してください。

### クイックデプロイ

1. [Vercel](https://vercel.com) にログイン
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリを選択
4. **Root Directory** を `packages/lp` に設定
5. 「Deploy」をクリック

## 注意事項

- CSSやJavaScriptは `<style>` タグや `<script>` タグでインラインに記述するか、外部ファイルとして同じディレクトリに配置してください
- 外部ファイルを使う場合は、相対パスで参照してください（例: `href="styles.css"`）
