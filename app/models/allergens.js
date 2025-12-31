const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('allergens', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "allergens_name_key"
    }
  }, {
    sequelize,
    tableName: 'allergens',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "allergens_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "allergens_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
