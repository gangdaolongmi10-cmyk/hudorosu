#!/bin/bash
# ビルド後の出力構造を確認するスクリプト
echo "=== TypeScript build output structure ==="
cd app
npm run build
echo ""
echo "=== dist directory structure ==="
find dist -name "index.js" -type f
echo ""
echo "=== dist directory tree ==="
tree dist -L 3 || find dist -type f | head -20
