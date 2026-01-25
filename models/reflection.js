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
    },

    content: {
        type: String,
        required: [true, "Perspective content cannot be empty."]
    },
    reflectionType: {
        type: String,
        enum: [
            'Growth', 'Gratitude', 'Hindsight', 'Longing', 'Lesson',
            'Amusement', 'Forgiveness', 'Revelation', 'Closure', 'Clarity'
        ],
        default: 'Growth'
    },
    growthScale: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
}, { timestamps: true });

const Reflection = mongoose.model('Reflection', reflectionSchema);
module.exports = Reflection;