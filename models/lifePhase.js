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
        trim: true,
        required: [
            function () { return this.endDate != null; },
            "A Curator's Statement is required once an exhibition has ended."
        ],
        validate: {
            validator: function (v) {
                if (this.endDate != null) {
                    return v && v.length >= 20;
                }
                return true;
            },
            message: "The summary must be at least 20 characters long to finalize this record."
        }
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

lifePhaseSchema.pre('save', function () {
    if (this.endDate && this.startDate) {
        if (new Date(this.startDate) > new Date(this.endDate)) {
    throw new Error("The exhibition cannot end before it begins.");
        }
    }
});

const LifePhase = mongoose.model('LifePhase', lifePhaseSchema);
module.exports = LifePhase;