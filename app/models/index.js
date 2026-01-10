'use strict';

const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
  const databaseUrl = process.env[config.use_env_variable];
  if (!databaseUrl) {
    throw new Error(`Environment variable ${config.use_env_variable} is not set`);
  }
  sequelize = new Sequelize(databaseUrl, {
    ...config,
    dialect: config.dialect || 'postgres',
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// init-models.jsを使用してモデルとアソシエーションを初期化
const initModels = require('./init-models');
const models = initModels(sequelize);

// dbオブジェクトにモデルを追加
const db = {
  ...models,
  sequelize,
  Sequelize
};

module.exports = db;
