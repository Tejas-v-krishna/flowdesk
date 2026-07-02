const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    progress: { type: Number, default: 0 },
    category: { type: String },
    deadline: { type: Date },
    status: {
        type: String,
        enum: ['active', 'completed', 'paused', 'archived'],
        default: 'active'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

goalSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Goal', goalSchema);
