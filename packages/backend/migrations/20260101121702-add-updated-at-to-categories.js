'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // updated_atカラムが存在しない場合のみ追加
    const tableDescription = await queryInterface.describeTable('categories');
    
    if (!tableDescription.updated_at) {
      await queryInterface.addColumn('categories', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // updated_atカラムを削除
    await queryInterface.removeColumn('categories', 'updated_at');
  }
};

