const { DataTypes } = require('sequelize');
const { sequelize } = require("../db");

const Event = sequelize.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 255]
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 255]
        }
    },
    eventDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    expGuests: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    tableName: 'events',
    timestamps: false,
});

module.exports = Event;