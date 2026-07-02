const Task = require('../models/Task');
const Project = require('../models/Project');

const getSummary = async (req, res) => {
    try {
        const userId = req.user;
        const totalTasks = await Task.countDocuments({ userId });
        const completedTasks = await Task.countDocuments({ userId, status: 'Done' });
        const activeProjects = await Project.countDocuments({ userId, status: 'Ongoing' });

        const productivityScore = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;

        // Velocity Data: last 7 days completed tasks
        const velocityData = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            const nextDay = new Date(d);
            nextDay.setDate(nextDay.getDate() + 1);

            const count = await Task.countDocuments({
                userId,
                status: 'Done',
                completedAt: { $gte: d, $lt: nextDay }
            });
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            velocityData.push({ day: dayName, tasks: count });
        }

        // Portfolio Data: projects by type
        const projects = await Project.find({ userId });
        const typeCounts = {};
        projects.forEach(p => {
            const t = p.type || 'Other';
            typeCounts[t] = (typeCounts[t] || 0) + 1;
        });

        const DONUT_COLORS = ["#71717a", "#a1a1aa", "#d4d4d8", "#e4e4e7", "#3f3f46", "#27272a"];
        const portfolioData = Object.keys(typeCounts).map((key, idx) => ({
            label: key,
            value: projects.length > 0 ? Math.round((typeCounts[key] / projects.length) * 100) + '%' : '0%',
            color: DONUT_COLORS[idx % DONUT_COLORS.length]
        }));

        res.json({
            stats: {
                totalTasks,
                completedTasks,
                activeProjects,
                productivityScore
            },
            velocityData,
            portfolioData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHeatmap = async (req, res) => {
    try {
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
