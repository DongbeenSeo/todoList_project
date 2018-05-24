import axios from 'axios'

//axios instance를 정의
const postAPI = axios.create({
    baseURL: process.env.API_URL
})

const rootEl = document.querySelector('.root');

function login(token) {
    localStorage.setItem('token', token);
    postAPI.defaults.headers['Authorization'] = `Bearer ${token}`;
    rootEl.classList.add('root--authed');
}

const templates = {
    main: document.querySelector('#main').content,
    login: document.querySelector('#login').content,
    todoContent: document.querySelector('#todo-content').content
};

function render(fragment) {
    rootEl.textContent = '';
    rootEl.appendChild(fragment);
}

async function mainPage() {
    const fragment = document.importNode(templates.main, true);
    const loginButtonEl = fragment.querySelector('.main__login-btn');
    loginButtonEl.addEventListener('click', e => {
        loginPage();
    })

    render(fragment);
}

async function loginPage() {
    const fragment = document.importNode(templates.login, true);
    const formEl = fragment.querySelector('.login__form');
    const backButtonEl = fragment.querySelector('.login__back-btn');

    formEl.addEventListener('submit', async e => {
        const payload = {
            username: e.target.elements.username.value,
            password: e.target.elemnets.password.value
        };
        e.preventDefault();
        const res = await postAPI.post('/users/login', payload);
        login(res.date.token);
        mainPage();
    })
    backButtonEl.addEventListener('click', e => {
        e.preventDefault();
        mainPage();
    })
    render(fragment);
}


if (localStorage.getItem('token')) {
    //classList에는 . 사용 X
    login(localStorage.getItem('token'));
}

mainPage();