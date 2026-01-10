const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('foods', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    best_before_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    calories: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    protein: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    fat: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    carbohydrate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    fiber: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    sodium: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    serving_size: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: '食材の価格（円）'
    }
  }, {
    sequelize,
    tableName: 'foods',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "foods_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
