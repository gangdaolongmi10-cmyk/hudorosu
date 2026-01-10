const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_recipe_favorites', {
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
      }
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'recipes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user_recipe_favorites',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "user_recipe_favorites_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_recipe_favorites_user_recipe_idx",
        unique: true,
        fields: [
          { name: "user_id" },
          { name: "recipe_id" },
        ]
      },
      {
        name: "user_recipe_favorites_user_id_idx",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "user_recipe_favorites_recipe_id_idx",
        fields: [
          { name: "recipe_id" },
        ]
      },
    ]
  });
};
