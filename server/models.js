//В этом файле описаны все модели, модели нужны чтобы описать таблицы в базе данных в коде, они создадутся автматически в подключнной базе данных если они уже созданы ничего не произойдёт
const sequelize = require("./database");
const {DataTypes} = require("sequelize");

//Модель пользователя
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
})

//Модель лабиринта
const Maze = sequelize.define('maze', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    image: {type: DataTypes.STRING, allowNull: false},
    print_count: {type: DataTypes.INTEGER, defaultValue: 0}
})

User.hasMany(Maze);
Maze.belongsTo(User);

module.exports = {
    User,
    Maze,
}
