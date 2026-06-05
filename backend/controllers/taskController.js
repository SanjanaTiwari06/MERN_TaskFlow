const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user (with search, filter, pagination)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Build query filter
    const filter = { userId: req.user._id };
    if (status && ['pending', 'completed'].includes(status)) filter.status = status;
    if (priority && ['low', 'medium', 'high'].includes(priority)) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limitNum),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { title, description, priority, status } = req.body;

    const task = await Task.create({
      title,
      description,
      priority: priority || 'medium',
      status: status || 'pending',
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { title, description, priority, status } = req.body;

    let task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task status (pending <-> completed)
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTaskStatus = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.status}!`,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task stats for dashboard
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [total, completed, pending, byPriority] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'completed' }),
      Task.countDocuments({ userId, status: 'pending' }),
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);

    const priorityMap = { low: 0, medium: 0, high: 0 };
    byPriority.forEach((p) => { priorityMap[p._id] = p.count; });

    res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        pending,
        completionRate: total ? Math.round((completed / total) * 100) : 0,
        byPriority: priorityMap,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, toggleTaskStatus, getTaskStats };
