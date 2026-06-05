const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All task routes are protected
router.use(protect);

// Validation rules
const taskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be 2–100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description max 500 chars'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Invalid status'),
];

// Routes
router.get('/stats',         getTaskStats);          // GET  /api/tasks/stats
router.get('/',              getTasks);               // GET  /api/tasks?status=&priority=&search=&page=&limit=
router.get('/:id',           getTask);                // GET  /api/tasks/:id
router.post('/',             taskValidation, createTask);  // POST /api/tasks
router.put('/:id',           taskValidation, updateTask);  // PUT  /api/tasks/:id
router.patch('/:id/toggle',  toggleTaskStatus);       // PATCH /api/tasks/:id/toggle
router.delete('/:id',        deleteTask);             // DELETE /api/tasks/:id

module.exports = router;
