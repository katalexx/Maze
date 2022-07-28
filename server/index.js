//Импорты библиотек и других файлов 
const express = require("express");
const path = require("path")
const cors = require("cors")
const sequelize = require("./database");
const fileUpload = require("express-fileupload");
const models = require("./models");
const { registration, login, saveMaze, getUserMazes } = require("./controllers");

//Создаём приложение используя библиотеку express
const app = express();
const PORT = 8000;
//Подключаем к нему различные middleware - они пропускают через себя запрос и могу как то влиять на входящие и выходяшие данные
//cors - нужен что бы мы могли слать запросы с браузера в это приложение 
app.use(cors());
//Этот middleware позволяет работать с форматом json в котором мы как раз передаем все данные 
app.use(express.json());
//Здесь передаётся путь до папки static и указывается что она отвечает за статирку это значит что все фотографии будут отдаваться из неё, сохраняются они так же там
app.use(express.static(path.resolve(__dirname, "static")));
//Позволяет посылать на наш сервер файлы в нашем случае фото лабиринтов
app.use(fileUpload({}));

//Все роуты по которым можно посылать запросы и получить в ответе данные
//Функции обрабатываюшие запросы и вызывающиеся по этим роутам в файле controllers.js
app.post('/user/registration', registration);
app.post('/user/login', login);
app.post('/maze/save', saveMaze);
app.post('/maze/get', getUserMazes);

async function start() {
    try {
        //поодключение базы данных
        await sequelize.authenticate();
        await sequelize.sync();
        //запуск сервера, после этой команды он начинает слушать запросы по переданному порту
        app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
    } catch (error) {
        //если будет какая либо ошибка она выйдет в логах
        console.log(error);        
    }
}

start()
