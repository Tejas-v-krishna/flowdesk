const { generateAIResponse } = require('../services/aiService');
const Project = require('../models/Project');
const Task = require('../models/Task');

const chat = async (req, res) => {
    try {
        const { messages } = req.body;

        // Fetch context
        const projects = await Project.find({ userId: req.user });
        const tasks = await Task.find({ userId: req.user });

        const stream = await generateAIResponse(messages, { projects, tasks });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const event of stream) {
            if (event.type === 'content_block_delta') {
                res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSuggestions = async (req, res) => {
    try {
        // Logic for top 3 suggested tasks
        const tasks = await Task.find({ userId: req.user, status: { $ne: 'Done' } });
        // For now, just return high priority or overdue
        const suggestions = tasks
            .sort((a, b) => (b.priority === 'High' ? 1 : -1))
            .slice(0, 3);

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { chat, getSuggestions };
