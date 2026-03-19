const Task = require('../models/Task');
const Project = require('../models/Project');

const getSummary = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({ userId: req.user });
        const completedTasks = await Task.countDocuments({ userId: req.user, status: 'Done' });
        const activeProjects = await Project.countDocuments({ userId: req.user, status: 'Active' });

        res.json({
            totalTasks,
            completedTasks,
            activeProjects,
            productivityScore: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHeatmap = async (req, res) => {
    try {
        // Basic heatmap data extraction
        const tasks = await Task.find({
            userId: req.user,
            status: 'Done',
            completedAt: { $exists: true }
        });

        const heatmap = tasks.reduce((acc, task) => {
            const date = task.completedAt.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        res.json(heatmap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSummary, getHeatmap };
