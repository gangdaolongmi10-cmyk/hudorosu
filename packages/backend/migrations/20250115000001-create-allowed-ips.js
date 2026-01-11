'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('allowed_ips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ip_address: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: '許可されたIPアドレス'
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'IPアドレスの説明'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '有効/無効フラグ'
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

    // IPアドレスにインデックスを追加
    await queryInterface.addIndex('allowed_ips', ['ip_address'], {
      name: 'idx_allowed_ips_ip_address'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('allowed_ips');
  }
};
