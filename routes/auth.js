// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Регистрация
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Заполните все поля' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email уже зарегистрирован' });
    }

    const user = new User({ username, email, password });
    await user.save();
    req.session.userId = user._id;
    res.json({ message: 'Регистрация успешна' });
});

// Вход
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    req.session.userId = user._id;
    res.json({ message: 'Вход выполнен' });
});

// Проверка авторизации
router.get('/check', (req, res) => {
    if (req.session.user) {
        res.json({ authorized: true, username: req.session.user.username });
    } else {
        res.json({ authorized: false });
    }
});

// Выход
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Вы вышли из аккаунта' });
});

module.exports = router;
