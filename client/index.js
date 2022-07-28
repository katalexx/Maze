//переменные для определения размера, цвета лабиринта
const CELL_CIZE = 9;
const PADDING = CELL_CIZE;
const WALL_COLOR = "black";
const FREE_CELL_COLOR = "white";
var COLUMNS = 21;
var ROWS = 21;
const ERASES_NUMBER = 5;
//получаем холст на котором будет отрисован лабиринт и все остальные html(dom) элементы
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const select = document.querySelector(".select");
const printBtn = document.querySelector(".print");
const saveBtn = document.querySelector(".save");
const generateBtn = document.querySelector(".generate");

//Задаём на кнопки обработчики клика 
generateBtn.addEventListener("click", create);
printBtn.addEventListener("click", () => printMaze(canvas.toDataURL()));
saveBtn.addEventListener("click", saveMaze);

//Функция печати лабиринита
function printMaze(src) {
    let img = new Image();
    img.src = src;
    //Открывается новое окно
    let newWindow = window.open("", "", "width=755.9100,height=755.9100");
    //Лабиринт копируется и вставляется в новое окно
    newWindow.document.body.appendChild(img);
    img.style.cssText = "margin: 100px auto; display: block;";
    //Вызывается функция печати из браузера но с небольшой задержкой так как лабиринт не появляется в новом окне мгновенно
    setTimeout(() => newWindow.print(), 0);
    //Окно закрывается после закрытия окна печати
    setTimeout(() => newWindow.close(), 0);
}

//функция генерирующая начальное поле
function generateMap(rows, columns) {
    const map = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
            row.push(false);
        }
        map.push(row);
    }
    
    return map;
}

//Функция создания лабиринта 
function create() {
    //В зависимости от выбранной сложности устанавливается размерность лабиринта
    if (select.value === "easy") {
        COLUMNS = 21;
        ROWS = 21;
    }
    if (select.value === "medium") {
        COLUMNS = 49;
        ROWS = 49;
    }

    if (select.value === "hard") {
        COLUMNS = 101;
        ROWS = 101;
    }
    //Вызывается функция генерирующая начальное поле(массив массивов), оно полностью заполнено false при дальнейшей отрисовке false-черный квадрат true-белый
    map = generateMap(ROWS, COLUMNS)
    //Первую клетку делаем сразу посещённой
    map[0][0] = true;
    //Создаём стёрки или где то их называют тракторами они будут случайно ходить по 4 направлениям на 2 клетки и расчищать так и появляются белые проходы
    let erases = [];
    for (let i = 0; i < ERASES_NUMBER; i++) {
        erases.push({
            x:0,
            y:0,
        })
    }
    //Цикл будет выполнятся пока лабиринт не построится окончательно
    while(!isMazeCreated()) {
        //постоянно вызывает метод стирания с каждой стёркой
        for (const erase of erases) {
            //Вызов метода стирания
            moveErase(erase)
        }
    }
    //В конце конов после того как он закончил расчищать вызывается метод который всё это отрисует на canvas
    drawMaze();
}

//Вызов функции создания при открытии страницы
create()

//Функция возвращает случайный элемент из переданного в неё массива
function getRandomItem(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

//Функция двигает ластик по возможным направлениям и расчищает исходное поле оставляя стенки
function moveErase(erase) {
    //В данный масив запишутся все варианты по которым стёрка может пойти их может быть всего 4 или меньше есои стёрка у стены
    const directionVariants = [];
    //В зависимости от текущего положения стёрки он запишет возможны передвижения в массив
    if (erase.x > 0) {
        directionVariants.push([-2, 0])
    }

    if (erase.x < COLUMNS - 1) {
        directionVariants.push([2, 0]);
    }

    if (erase.y > 0) {
        directionVariants.push([0, -2])
    }

    if (erase.y < ROWS - 1) {
        directionVariants.push([0, 2])
    }

    //Затем мы получем случайное направление(x и y) из возможных добавленных ранее
    const [directionX, directionY] = getRandomItem(directionVariants);
    //Двигаем на полученное направление(координаты) стёрку
    erase.x += directionX;
    erase.y += directionY;
    //если точка в которой стёрка сейчас ещё не была посещена то он ломает эту стену
    if (!map[erase.y][erase.x]) {
        map[erase.y][erase.x] = true;
        //Так же ломает стенку через которую он перешагнул так как ластик ходит на 2 клетки
        map[erase.y - directionY / 2][erase.x - directionX / 2] = true;
    }
}

//Функция отрисовывающая лабиринт на canvas в html
function drawMaze() {
    //Задаём ширину высоту полотна рассчитывя её с размера клетки
    canvas.width = PADDING * 2 + COLUMNS * CELL_CIZE;
    canvas.height = PADDING * 2 + ROWS * CELL_CIZE;

    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fill();

    //Проходимся циклами по нашей матрице и там где true будет белая клетка где false черная - то есть стенка
    for (let i = 0; i < COLUMNS; i++) {
        for (let j = 0; j < ROWS; j++) {
            const color = map[i][j] ? FREE_CELL_COLOR : WALL_COLOR;
        //Здесь я ловлю первую координату что бы сделать вход
        if (i == 0 && j == 0) {
            context.beginPath();
            context.rect(j * CELL_CIZE, PADDING + i * CELL_CIZE, CELL_CIZE, CELL_CIZE);
            context.fillStyle = "white"
            context.fill()
        }  
        //Здесь делаю выход
        if (i == COLUMNS - 1 && j == ROWS - 1) {
            context.beginPath();
            context.rect(j * CELL_CIZE + (CELL_CIZE * 2), PADDING + i * CELL_CIZE, CELL_CIZE, CELL_CIZE);
            context.fillStyle = "white"
            context.fill()
        }
        context.beginPath();
        context.rect(
            PADDING + j * CELL_CIZE,
            PADDING + i * CELL_CIZE, 
            CELL_CIZE, 
            CELL_CIZE);
        context.fillStyle = color;
        context.fill();
        }
    }
}

//Функция проверки построен ли лабиринт
function isMazeCreated() {
    for (let i = 0; i < COLUMNS; i += 2) {
        for(let j = 0; j < ROWS; j += 2) {
            if (!map[i][j]) {
                return false;
            }
        }
    }
    return true;
}

//Функция сохранения лабиринта в базе данных
async function saveMaze() {
    //Сохраняем канвас как картинку
    image = canvas.toDataURL("image/png");
    //отпраляем запрос с данными на сервер 
    const response = await fetch("http://localhost:8000/maze/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
            user: localStorage.getItem("user"),
            image,
        }),
    })
    const result = await response.json()
}
