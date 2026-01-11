'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'ユーザーID'
      },
      refresh_token: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
        comment: 'リフレッシュトークン'
      },
      ip_address: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'セッション作成時のIPアドレス'
      },
      user_agent: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'ユーザーエージェント'
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'セッション有効期限'
      },
      revoked_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'セッション無効化時刻'
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

    // インデックスを追加
    await queryInterface.addIndex('sessions', ['user_id'], {
      name: 'idx_sessions_user_id'
    });
    await queryInterface.addIndex('sessions', ['refresh_token'], {
      name: 'idx_sessions_refresh_token'
    });
    await queryInterface.addIndex('sessions', ['expires_at'], {
      name: 'idx_sessions_expires_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sessions');
  }
};
