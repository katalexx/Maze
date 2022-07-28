//В этом файле все функции обрабатывающие запросы по роутам из index.js
const { User, Maze } = require("./models");
const bcrypt = require("bcrypt");
const fs = require('fs');

//Функция регистрации пользователя
async function registration(req, res) {
    const {name, password} = req.body;
    if (!name || !password) {
        return res.status(404).json({message: "введите все данные"})
    }
    const isUserRegistered = await User.findOne({where: {name}});
    if (isUserRegistered) {
        return res.status(404).json({message: "пользователь уже зарегистрирован"})
    }
    const hashedPassword = await bcrypt.hash(password, 3);
    const user = await User.create({name, password: hashedPassword});
    return res.json(user);
}

//Функция авторизации пользователя
async function login(req, res) {
    const {name, password} = req.body;
    if (!name || !password) {
        return res.status(404).json({message: "введите все данные"})
    }
    const user = await User.findOne({where: {name}});
    if (!user) {
        return res.status(404).json({message: "такого пользователя не существует"})
    }
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
        return res.status(404).json({message: "неверный пароль"})
    }
    res.json(user);
}

//Функция сохранения фотографии лабиринта на сервер 
function saveImage(baseImage) {
    const uploadPath = __dirname;
    const localPath = `${uploadPath}/static/`;
    const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));
    const fileType = baseImage.substring("data:".length,baseImage.indexOf("/"));
    const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
    const base64Data = baseImage.replace(regex, "");
    const filename = `${Math.random().toString()}.${ext}`;
    fs.writeFileSync(localPath+filename, base64Data, 'base64');
    return filename;
}

//Функция сохранения сгенерированного пользователем лабиринта
async function saveMaze(req, res) {
    let {user, image} = req.body;
    const fileName = saveImage(image)
    const maze = await Maze.create({image: fileName, userId: JSON.parse(user).id});
    return res.json(maze).status(200)
}

//Функция получения всех лабиринтов сгенерированных пользователем
async function getUserMazes(req, res) {
    const {userId} = req.body;
    const mazes = await Maze.findAll({where: {userId}});
    return res.json(mazes);
}

module.exports = {
    registration,
    login,
    saveMaze,
    getUserMazes
};
