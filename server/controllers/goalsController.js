const Goal = require('../models/Goal');

const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGoal = async (req, res) => {
    try {
        const goal = new Goal({
            ...req.body,
            userId: req.user
        });
        const savedGoal = await goal.save();
        res.status(201).json(savedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user },
            req.body,
            { new: true }
        );
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json(goal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user });
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json({ message: 'Goal deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
};
