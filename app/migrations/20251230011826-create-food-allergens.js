'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('food_allergens', {
      food_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'foods', key: 'id' },
        onDelete: 'CASCADE'
      },
      allergen_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'allergens', key: 'id' },
        onDelete: 'CASCADE'
      }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('food_allergens'); }
};