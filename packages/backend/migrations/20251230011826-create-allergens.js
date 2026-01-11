'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('allergens', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, unique: true, allowNull: false }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('allergens'); }
};