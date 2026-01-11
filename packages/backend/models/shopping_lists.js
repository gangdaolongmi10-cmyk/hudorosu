const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shopping_lists', {
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
      allowNull: true,
      comment: '必要な数量（例: 200g, 1個）'
    },
    is_purchased: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '購入済みかどうか'
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'メモ'
    }
  }, {
    sequelize,
    tableName: 'shopping_lists',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "shopping_lists_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "shopping_lists_user_id_idx",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "shopping_lists_food_id_idx",
        fields: [
          { name: "food_id" },
        ]
      },
      {
        name: "shopping_lists_is_purchased_idx",
        fields: [
          { name: "is_purchased" },
        ]
      },
    ]
  });
};
