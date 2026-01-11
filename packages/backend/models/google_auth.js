const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('google_auth', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    google_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "google_auth_google_id_key"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'google_auth',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "google_auth_google_id_key",
        unique: true,
        fields: [
          { name: "google_id" },
        ]
      },
      {
        name: "google_auth_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
