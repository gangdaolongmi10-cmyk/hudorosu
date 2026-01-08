var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _allergens = require("./allergens");
var _categories = require("./categories");
var _food_allergens = require("./food_allergens");
var _foods = require("./foods");
var _google_auth = require("./google_auth");
var _local_auth = require("./local_auth");
var _login_logs = require("./login_logs");
var _recipe_foods = require("./recipe_foods");
var _recipes = require("./recipes");
var _settings = require("./settings");
var _stocks = require("./stocks");
var _transaction_categories = require("./transaction_categories");
var _transactions = require("./transactions");
var _users = require("./users");
var _faqs = require("./faqs");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var allergens = _allergens(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var food_allergens = _food_allergens(sequelize, DataTypes);
  var foods = _foods(sequelize, DataTypes);
  var google_auth = _google_auth(sequelize, DataTypes);
  var local_auth = _local_auth(sequelize, DataTypes);
  var login_logs = _login_logs(sequelize, DataTypes);
  var recipe_foods = _recipe_foods(sequelize, DataTypes);
  var recipes = _recipes(sequelize, DataTypes);
  var settings = _settings(sequelize, DataTypes);
  var stocks = _stocks(sequelize, DataTypes);
  var transaction_categories = _transaction_categories(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var faqs = _faqs(sequelize, DataTypes);

  allergens.belongsToMany(foods, { as: 'food_id_foods', through: food_allergens, foreignKey: "allergen_id", otherKey: "food_id" });
  foods.belongsToMany(allergens, { as: 'allergen_id_allergens', through: food_allergens, foreignKey: "food_id", otherKey: "allergen_id" });
  food_allergens.belongsTo(allergens, { as: "allergen", foreignKey: "allergen_id"});
  allergens.hasMany(food_allergens, { as: "food_allergens", foreignKey: "allergen_id"});
  foods.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(foods, { as: "foods", foreignKey: "category_id"});
  food_allergens.belongsTo(foods, { as: "food", foreignKey: "food_id"});
  foods.hasMany(food_allergens, { as: "food_allergens", foreignKey: "food_id"});
  foods.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(foods, { as: "foods", foreignKey: "user_id"});
  google_auth.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasOne(google_auth, { as: "google_auth", foreignKey: "user_id"});
  local_auth.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasOne(local_auth, { as: "local_auth", foreignKey: "user_id"});
  login_logs.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(login_logs, { as: "login_logs", foreignKey: "user_id"});
  stocks.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(stocks, { as: "stocks", foreignKey: "user_id"});
  stocks.belongsTo(foods, { as: "food", foreignKey: "food_id"});
  foods.hasMany(stocks, { as: "stocks", foreignKey: "food_id"});
  transaction_categories.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(transaction_categories, { as: "transaction_categories", foreignKey: "user_id"});
  transactions.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(transactions, { as: "transactions", foreignKey: "user_id"});
  transactions.belongsTo(transaction_categories, { as: "category", foreignKey: "category_id"});
  transaction_categories.hasMany(transactions, { as: "transactions", foreignKey: "category_id"});
  recipe_foods.belongsTo(recipes, { as: "recipe", foreignKey: "recipe_id"});
  recipe_foods.belongsTo(foods, { as: "food", foreignKey: "food_id"});
  recipes.belongsToMany(foods, { as: 'food_id_foods', through: recipe_foods, foreignKey: "recipe_id", otherKey: "food_id" });
  foods.belongsToMany(recipes, { as: 'recipe_id_recipes', through: recipe_foods, foreignKey: "food_id", otherKey: "recipe_id" });

  return {
    SequelizeMeta,
    allergens,
    categories,
    food_allergens,
    foods,
    google_auth,
    local_auth,
    login_logs,
    recipe_foods,
    recipes,
    settings,
    stocks,
    transaction_categories,
    transactions,
    users,
    faqs,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
