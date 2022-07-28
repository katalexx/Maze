const wrapper = document.querySelector(".wrapper");
const userName = document.querySelector(".user-name");
const quitButton  = document.querySelector(".quit");
userName.innerText = JSON.parse(localStorage.getItem("user")).name
quitButton.addEventListener("click", logOut);

//Функция запрашивает с сервера все лабиринты сгенерированные текущим пользователем
async function fetchMazes() {
    const res = await fetch("http://localhost:8000/maze/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({userId: JSON.parse(localStorage.getItem("user")).id})
    })
    return await res.json();
}

//Функция отривовывающая на странице все запрошенные лабиринты
async function renderMazes() {
    //Получаем лабиринты 
    let mazes = await fetchMazes();
    //Если сохранённые лабиринты есть
    if (mazes.length > 0) {
        //Проходимся по массиву лабиринтов и на каждой итерации 
        mazes.map(m => {
            //Получаем все html элементы из account.html
            const maze = document.createElement('div');
            const printButton = document.createElement('button');
            const generationDate = document.createElement('p');
            const topSide = document.createElement('div')
            //Задаём им классы с css стилями
            topSide.className = 'maze-top-side'
            maze.classList.add('maze-list-element');
            printButton.classList.add('default-btn');
            topSide.prepend(printButton)
            topSide.prepend(generationDate)
            printButton.innerText = 'распечатать лабиринт'
            generationDate.innerText =  `Сгенерирован ${m.createdAt.slice(0,10)}`
            maze.innerHTML = `
            <img src=http://localhost:8000/${m.image}>`
            wrapper.prepend(maze)
            wrapper.prepend(topSide)
            //Добавляем каждому лабиринту кнопку для его печати
            printButton.addEventListener("click", () => {
                let img = new Image();
                img.src = 'http://localhost:8000/' + m.image
                let myWindow = window.open("", "", "width=755.9100,height=755.9100")
                myWindow.document.body.appendChild(img)
                img.style.cssText = "margin: 100px auto; display: block;"
                setTimeout(() => {
                    myWindow.document.close()
                    myWindow.focus()
                    myWindow.print()
                    myWindow.close()
                }, 1000)
                })
        })    
    } else {
        //Если нет сохранённых лабиринтов выводим сообщение
        wrapper.innerHTML = "<h3>Пока сохранённых лабиринтов нет</h3>";
    }
}

//Функция выхода из аккаунта
function logOut() {
    localStorage.removeItem("user");
} 

//Вызываем функцию отрисовки списка лабиринтов при загрузке скрипта
renderMazes()
