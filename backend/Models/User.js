const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    chips: {
        type: Number,
        default: 0, // Default starting chips
    },
    isOnline:{
        type: Boolean,
        default: false,
    },
    lastActive: Date,
});

const User = mongoose.model('users', userSchema);

module.exports = User;