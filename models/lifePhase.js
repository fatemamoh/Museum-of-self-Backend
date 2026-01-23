const mongoose = require('mongoose');

const lifePhaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    summary: {
        type: String,
        required: [true, "A Curator's Statment is required to open this room."],
        minlength: 20
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        default: null
    },
    theme: {
        type: String,
        enum: ['gold', 'olive', 'charcoal', 'terracotta', 'slate'],
        default: 'gold'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true }
);

lifePhaseSchema.pre('save', function (next) {
    if (this.endDate && this.startDate > this.endDate) {
        const err = new Error("The exhibition cannot end before it begins.");
        next(err);
    }
    next();
});

const LifePhase = mongoose.model('LifePhase', lifePhaseSchema);
module.exports = LifePhase