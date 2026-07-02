const Task = require('../models/Task');
const Project = require('../models/Project');
const Goal = require('../models/Goal');
const Note = require('../models/Note');

const getRecentActivity = async (req, res) => {
    try {
        const userId = req.user;
        const limit = 10;
        
        // Fetch recent items from different collections
        const tasks = await Task.find({ userId }).sort({ updatedAt: -1 }).limit(limit).lean();
        const projects = await Project.find({ userId }).sort({ updatedAt: -1 }).limit(limit).lean();
        const goals = await Goal.find({ userId }).sort({ updatedAt: -1 }).limit(limit).lean();
        
        let activities = [];

        tasks.forEach(t => {
            activities.push({
                action: t.status === 'Done' ? 'Task completed' : 'Task updated',
                item: t.title,
                type: 'task',
                route: '/tasks',
                createdAt: t.updatedAt || t.createdAt,
                color: t.status === 'Done' ? 'text-green-500' : 'text-foreground'
            });
        });

        projects.forEach(p => {
            activities.push({
                action: 'Project updated',
                item: p.title,
                type: 'project',
                route: '/projects',
                createdAt: p.updatedAt || p.createdAt,
                color: 'text-foreground'
            });
        });

        goals.forEach(g => {
            activities.push({
                action: g.status === 'completed' ? 'Goal achieved' : 'Goal updated',
                item: g.title,
                type: 'goal',
                route: '/goals',
                createdAt: g.updatedAt || g.createdAt,
                color: g.status === 'completed' ? 'text-green-500' : 'text-foreground'
            });
        });

        // Sort combined array by date descending
        activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        res.json(activities.slice(0, 5));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRecentActivity };
