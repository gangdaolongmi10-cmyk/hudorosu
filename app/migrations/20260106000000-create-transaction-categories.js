'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaction_categories', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      color: { type: Sequelize.STRING(7), allowNull: true, defaultValue: '#3B82F6' },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // user_idとnameの組み合わせでユニーク制約を追加（ユーザーごとに同じ名前のカテゴリは作れない）
    await queryInterface.addIndex('transaction_categories', ['user_id', 'name'], {
      unique: true,
      name: 'transaction_categories_user_id_name_unique'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('transaction_categories');
  }
};

