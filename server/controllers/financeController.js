const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTransaction = async (req, res) => {
    try {
        const transaction = new Transaction({
            ...req.body,
            userId: req.user
        });
        const savedTransaction = await transaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user },
            req.body,
            { new: true }
        );
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSummary = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user });
        
        let totalIncome = 0;
        let totalExpense = 0;
        
        // Simple logic for the current month
        const now = new Date();
        let monthlyBurn = 0;
        let monthlyRevenue = 0;

        transactions.forEach(t => {
            const amount = Number(t.amount);
            if (t.type === 'income') {
                totalIncome += amount;
                if (t.date.getMonth() === now.getMonth() && t.date.getFullYear() === now.getFullYear()) {
                    monthlyRevenue += amount;
                }
            } else {
                totalExpense += Math.abs(amount);
                if (t.date.getMonth() === now.getMonth() && t.date.getFullYear() === now.getFullYear()) {
                    monthlyBurn += Math.abs(amount);
                }
            }
        });

        const netWorth = totalIncome - totalExpense;
        const runway = monthlyBurn > 0 ? (netWorth / monthlyBurn).toFixed(1) : 0;

        res.json({
            netWorth,
            monthlyBurn,
            monthlyRevenue,
            runway
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary
};
