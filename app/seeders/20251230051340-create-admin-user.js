'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 管理者ユーザーの作成
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // 既存のユーザーをチェック
    const existingUser = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = :email",
      {
        replacements: { email: adminEmail },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    // 既に存在する場合はスキップ
    if (existingUser && existingUser.length > 0) {
      console.log(`管理者ユーザー (${adminEmail}) は既に存在します。スキップします。`);
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    
    await queryInterface.bulkInsert('users', [
      {
        email: adminEmail,
        name: '管理者',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    // 作成されたユーザーのIDを取得
    const userId = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = :email",
      {
        replacements: { email: adminEmail },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (userId && userId.length > 0) {
      // 既存のlocal_authをチェック
      const existingAuth = await queryInterface.sequelize.query(
        "SELECT id FROM local_auth WHERE user_id = :userId",
        {
          replacements: { userId: userId[0].id },
          type: Sequelize.QueryTypes.SELECT
        }
      );

      if (!existingAuth || existingAuth.length === 0) {
        // ローカル認証情報の作成
        await queryInterface.bulkInsert('local_auth', [
          {
            user_id: userId[0].id,
            password_hash: passwordHash
          }
        ], {});
      }
    }
  },

  async down (queryInterface, Sequelize) {
    // 管理者ユーザーの削除
    const userId = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = :email",
      {
        replacements: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (userId && userId.length > 0) {
      await queryInterface.bulkDelete('local_auth', { user_id: userId[0].id }, {});
      await queryInterface.bulkDelete('users', { email: process.env.ADMIN_EMAIL || 'admin@example.com' }, {});
    }
  }
};

