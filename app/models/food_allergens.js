const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('food_allergens', {
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'foods',
        key: 'id'
      }
    },
    allergen_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'allergens',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'food_allergens',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "food_allergens_pkey",
        unique: true,
        fields: [
          { name: "food_id" },
          { name: "allergen_id" },
        ]
      },
    ]
  });
};
