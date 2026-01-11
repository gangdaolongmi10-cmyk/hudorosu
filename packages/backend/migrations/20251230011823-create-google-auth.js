'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('local_auth', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      refresh_token: { type: Sequelize.STRING }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('local_auth'); }
};