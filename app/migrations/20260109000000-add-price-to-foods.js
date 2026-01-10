'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('foods', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: '食材の価格（円）'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('foods', 'price');
  }
};
