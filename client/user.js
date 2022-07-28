const regButton = document.querySelector(".reg-btn");
const logButton = document.querySelector(".login-btn")
const accountButton = document.querySelector(".account");
const modal = document.querySelector(".modal")
const modalBg = document.querySelector(".modal-bg");
const closeModalBtn = document.querySelector(".modal-close");
const nameInput = document.querySelector(".name");
const passwordInput = document.querySelector(".password");
const submitBtn = document.querySelector(".submit-reg");

//Если пользлватель вошёл в систему скрывает кнопки регистрации и входа и показывает кнопку личного кабинета
if (localStorage.getItem("user")) {
    regButton.classList.add("hide");
    logButton.classList.add("hide");
    accountButton.classList.add("account-show");
}

//Открывает окно регистрации
regButton.addEventListener("click", () => {
    modal.children[0].innerText = "Регистрация";
    const btn = modal.querySelector("button");
    btn.innerText = 'Регистрация'
    modalBg.classList.add("bg-active");
    submitBtn.removeEventListener("click", submitLogin)
    submitBtn.addEventListener("click", submitRegistration);
})

//Открывет окно логина
logButton.addEventListener("click" , () => {
    modal.children[0].innerText = "Войти";
    const btn = modal.querySelector("button");
    btn.innerText = 'Войти'
    modalBg.classList.add("bg-active");
    submitBtn.removeEventListener("click", submitRegistration)
    submitBtn.addEventListener("click", submitLogin);
})

//Закрывает окно Регистрации или Логина
closeModalBtn.addEventListener("click", () => {
    modalBg.classList.remove("bg-active");
})

//Отправляет запрос с данными на сервер, регистрирует пользователя
async function submitRegistration() {
    const user = {
        name: nameInput.value,
        password: passwordInput.value,
    }
    
        const response = await fetch("http://localhost:8000/user/registration", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(user)
    });
     //Если статус ответа сервера не ошибочный сохраняем пользователя в браузере
    if (response.ok) {
        const result = await response.json();
        modal.classList.remove("bg-active");
        localStorage.setItem("user", JSON.stringify(result))
        window.location.reload();
    } else {
        //Если же ошибочный достаём из ответа не пользователя а соощение об ошибке и вставляем в окошко alert
        const error = await response.json();
        alert(error.message)
    }
    
}

//Отправляет запрос с данными на сервер, вход пользователя
async function submitLogin() {
    const user = {
        name: nameInput.value,
        password: passwordInput.value,
    }
        const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(user)
    });
    //Если статус ответа сервера не ошибочный сохраняем пользователя в браузере
    if (response.ok) {
        const result = await response.json();
        modal.classList.remove("bg-active");
        localStorage.setItem("user", JSON.stringify(result))
        window.location.reload();    
    } else {
        //Если же ошибочный достаём из ответа не пользователя а соощение об ошибке и вставляем в окошко alert
        const error = await response.json();
        alert(error.message)
    }
}
