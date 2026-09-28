const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @desc    Get all tasks belonging to the logged-in user
// @route   GET /api/tasks
// @access  Private
// Supports optional query params: ?completed=true|false&priority=low|medium|high&sortBy=deadline|priority|smart
const getTasks = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.completed === 'true') filter.completed = true;
    if (req.query.completed === 'false') filter.completed = false;
    if (['low', 'medium', 'high'].includes(req.query.priority)) {
      filter.priority = req.query.priority;
    }

    let tasks = await Task.find(filter).lean();

    tasks = sortTasks(tasks, req.query.sortBy);

    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { title, description, dateTime, deadline, priority } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dateTime,
      deadline,
      priority,
    });

    return res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (title, description, date/deadline, priority, completed)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure users can only modify their own tasks.
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this task' });
    }

    const allowedFields = ['title', 'description', 'dateTime', 'deadline', 'priority', 'completed'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    const updatedTask = await task.save();
    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle a task's completed status
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTaskCompleted = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this task' });
    }

    task.completed = !task.completed;
    const updatedTask = await task.save();
    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    return res.status(200).json({ message: 'Task deleted', _id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// Priority is mapped to a numeric weight so it can be combined with time urgency.
const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

// "Smart" sort: blends how close the deadline is with how urgent the priority is.
// A high-priority task due soon should surface above a low-priority task due slightly sooner.
// Score = hours until deadline, discounted by priority weight (lower score = show first).
function smartScore(task) {
  const hoursLeft = (new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60);
  const weight = PRIORITY_WEIGHT[task.priority] || 1;
  // Divide urgency by weight: higher priority effectively "pulls the task forward in time".
  return hoursLeft / weight;
}

function sortTasks(tasks, sortBy) {
  const copy = [...tasks];

  switch (sortBy) {
    case 'deadline':
      return copy.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    case 'priority':
      return copy.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
    case 'smart':
    default:
      // Incomplete tasks first, then blended urgency score ascending.
      return copy.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return smartScore(a) - smartScore(b);
      });
  }
}

module.exports = { getTasks, createTask, updateTask, toggleTaskCompleted, deleteTask };
