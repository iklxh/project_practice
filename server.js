const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/review');

dotenv.config();

const app = express();

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB подключен'))
    .catch(err => console.error('MongoDB ошибка:', err));

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false
}));

// Обслуживание статичных файлов
app.use(express.static(path.join(__dirname, 'public')));

// Роуты
app.use('/auth', authRoutes);
app.use('/review', reviewRoutes);

// Обработка ошибок 404
app.use((req, res) => {
    res.status(404).json({ message: 'Страница не найдена' });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
