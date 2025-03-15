const { validationResult } = require('express-validator');
const { Event, User, Guest, Task } = require('../models');

//Event by User ID
const getEventsByUserID = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: {
          model: Event,
          as: 'events',
          include: [
            { model: Guest, as: "guests" },
            { model: Task, as: "tasks" },
          ],
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const events = user.events || [];
      return res.json({ events });
    } catch (err) {
      console.error('Error fetching events by user ID:', err.message);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

//Single Event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        return res.json({ event });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
};

//Create Event
const createEvent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ msg: 'Invalid inputs, please check your data.' });
    }

    const { title, location, eventDate, expGuests, status, creator } = req.body;

    try {
        const user = await User.findByPk(creator);

        if (!user) {
            return res.status(404).json({ msg: 'Could not find user for this id.' });
        }

        const event = await Event.create({
            title,
            location,
            eventDate,
            expGuests,
            status,
            creator
        });

        await user.addEvent(event); 

        return res.status(201).json({ event: event.toJSON() });
    } catch (err) {
        console.error('Error saving event or user:', err);
        return res.status(500).send('Server Error');
    }
};

//Delete Event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        await event.destroy();
        return res.send('Event removed successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

//Update Event
const updateEvent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ msg: 'Invalid inputs, please check your data.' });
    }

    const { title, location, eventDate, expGuests } = req.body;

    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        event.title = title;
        event.location = location;
        event.eventDate = eventDate;
        event.expGuests = expGuests;

        await event.save(); 

        return res.status(200).json({ event: event.toJSON() });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

//Update Event Status (open or closed)
const statusUpdate = async (req, res) => {
    const { status } = req.body;

    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        event.status = status;
        await event.save();  // Sequelize automatically saves the updated event

        return res.status(200).json({ event: event.toJSON() });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getEventsByUserID = getEventsByUserID;
exports.getEventById = getEventById;
exports.createEvent = createEvent;
exports.deleteEvent = deleteEvent;
exports.updateEvent = updateEvent;
exports.statusUpdate = statusUpdate;
