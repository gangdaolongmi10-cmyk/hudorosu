// dotenvは本番環境では不要（環境変数は直接設定される）
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (e) {
    // dotenvが利用できない場合は無視
  }
}

module.exports = {
  development: {
    username: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "mydb",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres"
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      // IPv4を強制（IPv6接続の問題を回避）
      connectTimeout: 10000,
      // 接続プール設定
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    },
    logging: false
  }
};
