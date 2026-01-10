'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 栄養素カラムを追加（100gあたりの値で管理）
    await queryInterface.addColumn('foods', 'calories', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'カロリー（100gあたり、kcal）'
    });

    await queryInterface.addColumn('foods', 'protein', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'タンパク質（100gあたり、g）'
    });

    await queryInterface.addColumn('foods', 'fat', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: '脂質（100gあたり、g）'
    });

    await queryInterface.addColumn('foods', 'carbohydrate', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: '炭水化物（100gあたり、g）'
    });

    await queryInterface.addColumn('foods', 'fiber', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: '食物繊維（100gあたり、g）'
    });

    await queryInterface.addColumn('foods', 'sodium', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'ナトリウム（100gあたり、mg）'
    });

    await queryInterface.addColumn('foods', 'serving_size', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: '1食分の量（g）'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('foods', 'serving_size');
    await queryInterface.removeColumn('foods', 'sodium');
    await queryInterface.removeColumn('foods', 'fiber');
    await queryInterface.removeColumn('foods', 'carbohydrate');
    await queryInterface.removeColumn('foods', 'fat');
    await queryInterface.removeColumn('foods', 'protein');
    await queryInterface.removeColumn('foods', 'calories');
  }
};

