'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'daily_food_budget', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '1日の目標食費（円）'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'daily_food_budget');
  }
};

