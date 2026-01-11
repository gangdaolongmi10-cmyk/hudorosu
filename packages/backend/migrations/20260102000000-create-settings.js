'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('settings', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      key: { type: Sequelize.STRING, unique: true, allowNull: false },
      value: { type: Sequelize.TEXT, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // デフォルト設定を挿入
    await queryInterface.bulkInsert('settings', [
      {
        key: 'app_name',
        value: 'FoodDB',
        description: 'アプリケーション名',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'app_description',
        value: '食材管理システム',
        description: 'アプリケーションの説明',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'maintenance_mode',
        value: 'false',
        description: 'メンテナンスモード（true/false）',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'password_min_length',
        value: '6',
        description: 'パスワードの最小文字数',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'session_timeout',
        value: '24',
        description: 'セッションタイムアウト（時間）',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'max_login_attempts',
        value: '5',
        description: '最大ログイン試行回数',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  down: async (queryInterface) => { 
    await queryInterface.dropTable('settings'); 
  }
};

