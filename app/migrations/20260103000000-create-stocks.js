'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ENUM型を作成（PostgreSQLの場合）
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_stocks_storage_type" AS ENUM ('refrigerator', 'freezer', 'pantry');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.createTable('stocks', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      food_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'foods', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      expiry_date: { type: Sequelize.DATEONLY, allowNull: false },
      storage_type: {
        type: Sequelize.ENUM('refrigerator', 'freezer', 'pantry'),
        allowNull: false,
        defaultValue: 'refrigerator'
      },
      quantity: { type: Sequelize.STRING, allowNull: true },
      memo: { type: Sequelize.TEXT, allowNull: true },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('stocks');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_stocks_storage_type";');
  }
};

