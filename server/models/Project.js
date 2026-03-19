const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['Ongoing', 'Completed', 'Paused', 'Archived'],
        default: 'Ongoing'
    },
    type: { type: String },
    color: { type: String, default: '#f0a500' },
    techStack: [{ type: String }],
    startDate: { type: Date },
    endDate: { type: Date },
    resources: [{
        label: String,
        url: String
    }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

projectSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Project', projectSchema);
