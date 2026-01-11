'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recipes', {
      id: { 
        allowNull: false, 
        autoIncrement: true, 
        primaryKey: true, 
        type: Sequelize.INTEGER 
      },
      name: { 
        type: Sequelize.STRING(255), 
        allowNull: false 
      },
      description: { 
        type: Sequelize.TEXT, 
        allowNull: true 
      },
      image_url: { 
        type: Sequelize.STRING(500), 
        allowNull: true 
      },
      cooking_time: { 
        type: Sequelize.INTEGER, 
        allowNull: true,
        comment: '調理時間（分）'
      },
      servings: { 
        type: Sequelize.INTEGER, 
        allowNull: true,
        comment: '人数'
      },
      instructions: { 
        type: Sequelize.TEXT, 
        allowNull: true,
        comment: '作り方'
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

    // 料理-食材の関連テーブル
    await queryInterface.createTable('recipe_foods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recipe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'recipes', key: 'id' },
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
        comment: '分量（例: 200g, 1個）'
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
    await queryInterface.addIndex('recipe_foods', ['recipe_id'], {
      name: 'recipe_foods_recipe_id_idx'
    });
    await queryInterface.addIndex('recipe_foods', ['food_id'], {
      name: 'recipe_foods_food_id_idx'
    });
    await queryInterface.addIndex('recipe_foods', ['recipe_id', 'food_id'], {
      name: 'recipe_foods_recipe_food_idx',
      unique: true
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('recipe_foods');
    await queryInterface.dropTable('recipes');
  }
};

