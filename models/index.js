const { sequelize } = require('../db');
const Guest = require('./guest');
const Event = require('./Event');
const Task = require('./task');
const User = require('./user');

// Définir les relations
Event.hasMany(Guest, { foreignKey: 'toEvent', as: "guests" });
Guest.belongsTo(Event, { foreignKey: 'toEvent', as: "event" });

Event.hasMany(Task, { foreignKey: 'toEvent', as: "tasks" });
Task.belongsTo(Event, { foreignKey: 'toEvent', as: "event" });

Event.belongsTo(User, { foreignKey: 'creator', as: "usersId" });
User.hasMany(Event, { foreignKey: 'creator', as: "events" });

module.exports = {
    Guest,
    Event,
    Task,
    User,
    sequelize
};