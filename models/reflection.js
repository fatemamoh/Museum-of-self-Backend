const mongoose = require('mongoose');

const reflectionSchema = new mongoose.Schema({
    memory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Memory',
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});