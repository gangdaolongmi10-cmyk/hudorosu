'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ENUM型を作成（PostgreSQLの場合）
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_transactions_type" AS ENUM ('income', 'expense');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.createTable('transactions', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'transaction_categories', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL'
      },
      type: {
        type: Sequelize.ENUM('income', 'expense'),
        allowNull: false
      },
      amount: { 
        type: Sequelize.DECIMAL(12, 2), 
        allowNull: false,
        defaultValue: 0.00
      },
      description: { type: Sequelize.TEXT, allowNull: true },
      transaction_date: { 
        type: Sequelize.DATEONLY, 
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_DATE')
      },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // インデックスを追加（検索パフォーマンス向上のため）
    await queryInterface.addIndex('transactions', ['user_id']);
    await queryInterface.addIndex('transactions', ['transaction_date']);
    await queryInterface.addIndex('transactions', ['type']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('transactions');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_transactions_type";');
  }
};

