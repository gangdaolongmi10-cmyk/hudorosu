# Hudorosu Mobile App

React Native + Expo Go を使用したモバイルアプリケーション

## セットアップ

### 1. 依存関係のインストール

```bash
cd mobile
npm install
```

または、ルートディレクトリから：

```bash
npm run install:all
```

### 2. 開発サーバーの起動

```bash
cd mobile
npm start
```

または、ルートディレクトリから：

```bash
npm run dev:mobile
```

### 3. Expo Goでアプリを開く

1. スマートフォンに [Expo Go](https://expo.dev/client) アプリをインストール
2. 開発サーバー起動後、QRコードが表示されます
3. Expo GoアプリでQRコードをスキャンしてアプリを開く

## 開発時の注意事項

### API接続について

モバイルデバイスから `localhost` にアクセスすることはできません。実機でテストする場合は、以下の手順を実行してください：

1. コンピュータのIPアドレスを確認：
   - macOS: `ipconfig getifaddr en0` または `ifconfig | grep "inet "`
   - Windows: `ipconfig` で IPv4 アドレスを確認

2. `mobile/src/config/api.ts` の `DEV_IP_ADDRESS` を更新：
   ```typescript
   const DEV_IP_ADDRESS = '192.168.1.100'; // あなたのIPアドレスに変更
   ```
   例: `'192.168.1.100'`（localhostの代わりにIPアドレスを設定）

3. バックエンドサーバーが起動していることを確認

4. スマートフォンとコンピュータが同じWi-Fiネットワークに接続されていることを確認

**注意**: エミュレータ/シミュレータを使用する場合は、`DEV_IP_ADDRESS` を `'localhost'` のままにしておいてください。

### エミュレータ/シミュレータの場合

iOSシミュレータやAndroidエミュレータを使用する場合は、`localhost` のままで動作します。

## プロジェクト構造

```
mobile/
├── src/
│   ├── config/
│   │   └── api.ts          # API設定
│   ├── contexts/
│   │   └── AuthContext.tsx # 認証コンテキスト
│   └── screens/
│       ├── LoginScreen.tsx # ログイン画面
│       └── HomeScreen.tsx  # ホーム画面
├── App.tsx                 # メインアプリコンポーネント
└── package.json
```

## 機能
- ログイン機能（JWT認証）
- 認証状態の管理
- ホーム画面
- ログアウト機能

## 今後の拡張

ユーザー向けの機能を `src/screens/` に追加してください。
