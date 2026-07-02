const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

transactionSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Transaction', transactionSchema);
