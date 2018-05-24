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

function logout() {
    localStorage.removeItem('token');
    delete postAPI.defaults.headers['Authorization'];
    rootEl.classList.remove('root--authed');
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
    const logoutEl = fragment.querySelector('.main__logout-btn');
    loginButtonEl.addEventListener('click', e => {
        loginPage();
    })
    logoutEl.addEventListener('click', e => {
        logout();
        mainPage();
    })
    if (localStorage.getItem('token')) {
        const todoContentFragment = document.importNode(templates.todoContent, true)
        const todosRes = await postAPI.get('/todos');
        todosRes.data.forEach(todo => {
            const bodyEl = todoContentFragment.querySelector('.todo-content__body');
            bodyEl.textContent = todo.body;
        })
    }

    render(fragment);
}

async function loginPage() {
    const fragment = document.importNode(templates.login, true);
    const formEl = fragment.querySelector('.login__form');
    const backButtonEl = fragment.querySelector('.login__back-btn');

    formEl.addEventListener('submit', async e => {
        const payload = {
            username: e.target.elements.username.value,
            password: e.target.elements.password.value
        };
        e.preventDefault();
        const res = await postAPI.post('/users/login', payload)
        login(res.data.token);
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