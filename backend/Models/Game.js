const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
        },
    ],
    deck: {
        type: Array,
        required: true,
    },
    pot: {
        type: Number,
        default: 0,
    },
    currentTurn: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['waiting', 'in-progress', 'completed'],
        default: 'waiting',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;