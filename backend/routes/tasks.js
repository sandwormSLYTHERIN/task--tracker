const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all tasks with filtering, search, pagination, and sorting
router.get('/', auth, async (req, res, next) => {
  try {
    const { status, priority, search, sortby, page = 1, limit = 10 } = req.query;
    const query = { user: req.user.id };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };
    
    let sort = { createdAt: -1 };
    if (sortby === 'oldest') sort = { createdAt: 1 };
    
    const tasks = await Task.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
      
    const total = await Task.countDocuments(query);
    res.json({ tasks, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
});

// Create task
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;
    const task = new Task({ title, description, status, priority, user: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// Update task
router.put('/:id', auth, async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// Delete task
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
});

// Get task analytics
router.get('/analytics', auth, async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
