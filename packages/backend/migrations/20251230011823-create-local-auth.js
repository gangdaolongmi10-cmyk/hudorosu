'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('google_auth', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      google_id: { type: Sequelize.STRING, unique: true, allowNull: false },
      email: { type: Sequelize.STRING }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('google_auth'); }
};