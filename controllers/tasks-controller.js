const { validationResult } = require('express-validator');
const { Task, Event } = require('../models');

// Create Task to the Event
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Invalid inputs, please check your data.',
      errors: errors.array(),
    });
  }

  const { task, endDate, isDone, toEvent } = req.body;

  try {
    const event = await Event.findByPk(toEvent);
    if (!event) {
      return res.status(404).json({ message: 'Event not found with the given ID.' });
    }

    const newTask = await Task.create({
      task,
      endDate,
      isDone,
      toEvent,
    });

    return res.status(201).json({ message: 'Task created', task: newTask });
  } catch (err) {
    console.error('Error creating task:', err.message);
    return res.status(500).json({ message: 'Server error creating task', error: err.message });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    return res.json({ tasks });
  } catch (err) {
    console.error('Error fetching all tasks:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all tasks that belong to the event
const getTasksByEventId = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: { model: Task, as: 'tasks' }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found with this ID.' });
    }

    const tasks = event.tasks || [];
    return res.json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks by event ID:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const taskToDelete = await Task.findByPk(req.params.id);
    if (!taskToDelete) {
      return res.status(404).json({ message: 'Task not found with this ID.' });
    }

    await taskToDelete.destroy();

    return res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    return res.status(500).json({ message: 'Server error deleting task', error: err.message });
  }
};

// Update task status
const updateStatus = async (req, res) => {
  const { isDone } = req.body;

  try {
    const taskToUpdate = await Task.findByPk(req.params.id);
    if (!taskToUpdate) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await taskToUpdate.update({ isDone });
    return res.status(200).json({ message: 'Task status updated', task: taskToUpdate });
  } catch (err) {
    console.error('Error updating task status:', err.message);
    return res.status(500).json({ message: 'Server error updating task status', error: err.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTasksByEventId,
  deleteTask,
  updateStatus,
};