'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 買い物リストテーブル
    await queryInterface.createTable('shopping_lists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      food_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'foods', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '必要な数量（例: 200g, 1個）'
      },
      is_purchased: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '購入済みかどうか'
      },
      memo: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'メモ'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // インデックスの追加
    await queryInterface.addIndex('shopping_lists', ['user_id'], {
      name: 'shopping_lists_user_id_idx'
    });
    await queryInterface.addIndex('shopping_lists', ['food_id'], {
      name: 'shopping_lists_food_id_idx'
    });
    await queryInterface.addIndex('shopping_lists', ['is_purchased'], {
      name: 'shopping_lists_is_purchased_idx'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('shopping_lists');
  }
};
