'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ユーザー-レシピお気に入りテーブル
    await queryInterface.createTable('user_recipe_favorites', {
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
      recipe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'recipes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.addIndex('user_recipe_favorites', ['user_id'], {
      name: 'user_recipe_favorites_user_id_idx'
    });
    await queryInterface.addIndex('user_recipe_favorites', ['recipe_id'], {
      name: 'user_recipe_favorites_recipe_id_idx'
    });
    // ユーザーとレシピの組み合わせは一意
    await queryInterface.addIndex('user_recipe_favorites', ['user_id', 'recipe_id'], {
      name: 'user_recipe_favorites_user_recipe_idx',
      unique: true
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_recipe_favorites');
  }
};
