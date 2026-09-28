const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  createTask,
  updateTask,
  toggleTaskCompleted,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All task routes require a logged-in user.
router.use(protect);

const taskValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('dateTime').isISO8601().withMessage('dateTime must be a valid date'),
  body('deadline').isISO8601().withMessage('deadline must be a valid date'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
];

router.get('/', getTasks);
router.post('/', taskValidationRules, createTask);
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('dateTime').optional().isISO8601().withMessage('dateTime must be a valid date'),
    body('deadline').optional().isISO8601().withMessage('deadline must be a valid date'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('completed').optional().isBoolean().withMessage('completed must be a boolean'),
  ],
  updateTask
);
router.patch('/:id/toggle', toggleTaskCompleted);
router.delete('/:id', deleteTask);

module.exports = router;
