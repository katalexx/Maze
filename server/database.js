//Подключение базы данных
const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
    "maze",
    "postgres",
    "123456",
    {
        dialect: "postgres",
        host: "localhost",
        port: "5432"
    }
)
