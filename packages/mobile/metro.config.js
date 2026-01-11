const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// watchFoldersにsharedディレクトリを追加（モノレポ構成の場合に必要）
config.watchFolders = [
  path.resolve(__dirname, '../shared'),
];

module.exports = config;

