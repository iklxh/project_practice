document.getElementById('year').textContent = new Date().getFullYear();

const registerModal = document.getElementById('registerModal');
const loginModal = document.getElementById('loginModal');
const reviewModal = document.getElementById('reviewModal');

const reviewForm = document.getElementById('reviewForm');
const reviewText = document.getElementById('reviewText');
const reviewsList = document.getElementById('reviewsList');

// Показываем отзывы при загрузке
loadReviews();

// Проверяем авторизацию
let isLoggedIn = false;
checkAuth();

// Обработка регистрации
registerModal.querySelector('button').addEventListener('click', async () => {
    const inputs = registerModal.querySelectorAll('input');
    const username = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value.trim();

    const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
    });

    const data = await res.json();
    alert(data.message);
    if (res.ok) {
        bootstrap.Modal.getInstance(registerModal).hide();
        isLoggedIn = true;
        checkAuth();
    }
});

// Обработка входа
loginModal.querySelector('button').addEventListener('click', async () => {
    const inputs = loginModal.querySelectorAll('input');
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    });

    const data = await res.json();
    alert(data.message);
    if (res.ok) {
        bootstrap.Modal.getInstance(loginModal).hide();
        isLoggedIn = true;
        checkAuth();
    }
});

// Обработка формы отзыва
reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
        alert('Чтобы оставить отзыв, нужно войти!');
        return;
    }

    const text = reviewText.value.trim();
    const res = await fetch('/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        credentials: 'include'
    });

    const data = await res.json();
    alert(data.message);
    if (res.ok) {
        reviewText.value = '';
        bootstrap.Modal.getInstance(reviewModal).hide();
        loadReviews();
        checkAuth();
    }
});

// Загрузка отзывов
async function loadReviews() {
    const res = await fetch('/review');
    const data = await res.json();
    reviewsList.innerHTML = '';

    if (data.length === 0) {
        reviewsList.innerHTML = '<p>Пока нет отзывов.</p>';
        return;
    }

    data.forEach(review => {
        const div = document.createElement('div');
        div.className = 'mb-3 p-3 border rounded bg-light';
        div.innerHTML = `<strong>${review.user}</strong><br><small>${new Date(review.createdAt).toLocaleString()}</small><p>${review.text}</p>`;
        reviewsList.appendChild(div);
    });
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
    const res = await fetch('/auth/logout');
    const data = await res.json();
    alert(data.message);
    isLoggedIn = false;
    checkAuth();
});


// Проверка авторизации
async function checkAuth() {
    const res = await fetch('/auth/check', { credentials: 'include' });
    const data = await res.json();
    isLoggedIn = data.authorized;

    const userInfo = document.getElementById('userInfo');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (isLoggedIn) {
        userInfo.classList.remove('d-none');
        usernameDisplay.textContent = data.username || 'Пользователь';
    } else {
        userInfo.classList.add('d-none');
        usernameDisplay.textContent = '';
    }
}
