const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String // В проде: хешировать
});

module.exports = mongoose.model('User', userSchema);
