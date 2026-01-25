const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Every artifact needs a title for the muesum catalog'],
        trim: true
    },

    type: {
        type: String,
        enum: ['Text', 'Image', 'Video', 'Audio', 'Link'],
        default: 'Text'
    },

    size: {
        type: String,
        enum: ['Small', 'Medium', 'Large'],
        default: 'Medium'
    },
    contentUrl: {
        type: String,
        required: function () { return this.type !== 'Text' }
    },

    story: {
        type: String
    },
    curatorNote: {
        type: String,
        maxlength: 150
    },

    moodTag: {
        type: String,
        enum: [
            'Nostalgic', 'Victorious', 'Radiant', 'Joyful',
            'Quiet', 'Chaotic', 'Melancholic', 'Inspirational',
            'Anxious', 'Peaceful', 'Bittersweet', 'Humorous',
            'Profound', 'Ordinary', 'Rebellious'
        ],
        default: 'Ordinary'
    },

    origin: {
        type: String,
        enum: [
            'Self-Made', 'Gifted', 'Rediscovered', 'Snapshot', 'Shared',
            'Found', 'Hand-Me-Down', 'Collection', 'Soundtrack', 'Message',
            'Screen-Grab', 'Recording', 'Thought', 'Witnessed', 'Lesson',
            'Souvenir', 'Milestone', 'Habit'
        ],
        default: 'Self-Made'
    },

    capturedDate: {
        type: Date,
        required: [true, "The date of this occurrece is required for the timeline"]
    },

    isVaulted: {
        type: Boolean,
        default: false
    },
    unlockDate: {
        type: Date,
        default: null
    },
    phase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LifePhase',
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, { timestamps: true });
const Memory = mongoose.model('Memory', memorySchema);

module.exports = Memory;