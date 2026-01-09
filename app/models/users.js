const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "users_email_key"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "user"
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    daily_food_budget: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '1日の目標食費（円）'
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "users_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
