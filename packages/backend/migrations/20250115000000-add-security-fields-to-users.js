'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // アカウントロック関連のフィールドを追加
    await queryInterface.addColumn('users', 'failed_login_attempts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '連続ログイン失敗回数'
    });

    await queryInterface.addColumn('users', 'locked_until', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'アカウントロック解除時刻'
    });

    await queryInterface.addColumn('users', 'last_login_ip', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: '最後のログインIPアドレス'
    });

    await queryInterface.addColumn('users', 'last_login_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: '最後のログイン時刻'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'failed_login_attempts');
    await queryInterface.removeColumn('users', 'locked_until');
    await queryInterface.removeColumn('users', 'last_login_ip');
    await queryInterface.removeColumn('users', 'last_login_at');
  }
};
