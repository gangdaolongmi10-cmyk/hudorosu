const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sessions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'ユーザーID'
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      comment: 'リフレッシュトークン'
    },
    ip_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'セッション作成時のIPアドレス'
    },
    user_agent: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'ユーザーエージェント'
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'セッション有効期限'
    },
    revoked_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'セッション無効化時刻'
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'sessions',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "sessions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_sessions_user_id",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "idx_sessions_refresh_token",
        fields: [
          { name: "refresh_token" },
        ]
      },
      {
        name: "idx_sessions_expires_at",
        fields: [
          { name: "expires_at" },
        ]
      },
    ]
  });
};
