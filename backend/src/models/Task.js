const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // fast lookup of "all tasks for this user"
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    dateTime: {
      // when the task is scheduled/planned for
      type: Date,
      required: [true, 'Date and time is required'],
    },
    deadline: {
      // hard deadline by which the task must be completed
      type: Date,
      required: [true, 'Deadline is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Common query pattern: fetch a user's tasks sorted by deadline.
taskSchema.index({ user: 1, deadline: 1 });

module.exports = mongoose.model('Task', taskSchema);
