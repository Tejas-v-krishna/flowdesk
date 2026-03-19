const Task = require('../models/Task');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user }).sort({ order: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            userId: req.user
        });
        const savedTask = await task.save();

        const io = req.app.get('io');
        if (io) {
            io.to(`user_${req.user}`).emit('task_created', savedTask);
        }

        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const io = req.app.get('io');
        if (io) {
            io.to(`user_${req.user}`).emit('task_updated', task);
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const io = req.app.get('io');
        if (io) {
            io.to(`user_${req.user}`).emit('task_deleted', req.params.id);
        }

        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const bulkUpdateTasks = async (req, res) => {
    try {
        const { taskIds, updates } = req.body;
        await Task.updateMany(
            { _id: { $in: taskIds }, userId: req.user },
            { $set: updates }
        );

        const io = req.app.get('io');
        if (io) {
            io.to(`user_${req.user}`).emit('tasks_bulk_updated');
        }

        res.json({ message: 'Tasks updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    bulkUpdateTasks
};
