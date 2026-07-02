const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
// app.use(cookieParser()); // Need to install cookie-parser if not yet

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set io instance so it can be used in routes/controllers
app.set('io', io);

// Socket.io
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Optional: Clients can join rooms based on their user ID to receive targeted updates
    socket.on('join_user_room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`Socket ${socket.id} joined room user_${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/goals', require('./routes/goalsRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));

app.get('/', (req, res) => {
    res.send('FlowDesk API is running');
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

