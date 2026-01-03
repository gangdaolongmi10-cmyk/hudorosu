const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('recipe_foods', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'recipes',
        key: 'id'
      }
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'foods',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'recipe_foods',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "recipe_foods_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "recipe_foods_recipe_food_idx",
        unique: true,
        fields: [
          { name: "recipe_id" },
          { name: "food_id" },
        ]
      },
    ]
  });
};

