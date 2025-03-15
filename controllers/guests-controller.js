const { validationResult } = require('express-validator');
const { Event, Guest } = require('../models');

// Ajouter un invité à un événement
const addNewGuest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Invalid inputs, please check your data.',
      errors: errors.array(),
    });
  }

  const { firstName, lastName, age, email, gender, isConfirmed, toEvent } = req.body;

  try {
    const event = await Event.findByPk(toEvent);
    if (!event) {
      return res.status(404).json({ message: 'Event not found with this ID.' });
    }

    const newGuest = await Guest.create({
      firstName,
      lastName,
      age,
      email,
      gender,
      isConfirmed,
      toEvent,
    });

    return res.status(201).json({ message: 'Guest created', guest: newGuest });
  } catch (err) {
    console.error('Error creating guest:', err.message);
    return res.status(500).json({ message: 'Server error creating guest', error: err.message });
  }
};

// Get all guests invited to the Event
const getGuestsByEventId = async (req, res) => {
  const eventId = req.params.id;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required.' });
  }

  try {
    const event = await Event.findByPk(eventId, {
      include: { model: Guest, as: 'guests' }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const guests = event.guests || [];
    return res.json({ guests });
  } catch (err) {
    console.error('Error fetching guests by event ID:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single Guest by ID
const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found.' });
    }

    return res.json({ guest });
  } catch (err) {
    console.error('Error fetching guest by ID:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete Guest by ID
const deleteGuest = async (req, res) => {
  try {
    const guestToDelete = await Guest.findByPk(req.params.id);
    if (!guestToDelete) {
      return res.status(404).json({ message: 'Guest not found.' });
    }

    await guestToDelete.destroy();

    return res.status(200).json({ message: 'Guest deleted successfully.' });
  } catch (err) {
    console.error('Error deleting guest:', err.message);
    return res.status(500).json({ message: 'Server error deleting guest', error: err.message });
  }
};

// Update Guest status (confirmed or not)
const updateStatus = async (req, res) => {
  const { isConfirmed } = req.body;

  try {
    const guestToUpdate = await Guest.findByPk(req.params.id);
    if (!guestToUpdate) {
      return res.status(404).json({ message: 'Guest not found.' });
    }

    await guestToUpdate.update({ isConfirmed });
    return res.json({ message: 'Guest status updated', guest: guestToUpdate });
  } catch (err) {
    console.error('Error updating guest status:', err.message);
    return res.status(500).json({ message: 'Server error updating guest status', error: err.message });
  }
};

// Update Guest
const updateGuest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Invalid inputs, please check your data.',
      errors: errors.array(),
    });
  }

  const { firstName, lastName, age, email, gender } = req.body;

  try {
    const guestToUpdate = await Guest.findByPk(req.params.id);
    if (!guestToUpdate) {
      return res.status(404).json({ message: 'Guest not found.' });
    }

    await guestToUpdate.update({ firstName, lastName, age, email, gender });
    return res.json({ message: 'Guest updated', guest: guestToUpdate });
  } catch (err) {
    console.error('Error updating guest:', err.message);
    return res.status(500).json({ message: 'Server error updating guest', error: err.message });
  }
};

module.exports = {
  addNewGuest,
  getGuestsByEventId,
  getGuestById,
  deleteGuest,
  updateGuest,
  updateStatus,
};