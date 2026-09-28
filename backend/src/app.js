const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check - useful to confirm the server + device/emulator networking works
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'To-Do API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 + error handling (must be registered last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
