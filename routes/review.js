// routes/review.js
const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const User = require('../models/user');

// Получение отзывов
router.get('/', async (req, res) => {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
});

// Добавление отзыва (только авторизованные)
router.post('/', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const review = new Review({
        user: user.username,
        text: req.body.text
    });

    await review.save();
    res.json({ message: 'Отзыв добавлен' });
});

module.exports = router;
