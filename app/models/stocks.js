const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stocks', {
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
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    storage_type: {
      type: DataTypes.ENUM('refrigerator', 'freezer', 'pantry'),
      allowNull: false,
      defaultValue: 'refrigerator'
    },
    quantity: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'stocks',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "stocks_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "stocks_user_id_idx",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "stocks_food_id_idx",
        fields: [
          { name: "food_id" },
        ]
      },
    ]
  });
};

