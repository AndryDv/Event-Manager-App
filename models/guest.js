const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Guest = sequelize.define("Guest", {
    firstName: { type: DataTypes.STRING, allowNull: false, validate: { len: [2, 255] } },
    lastName: { type: DataTypes.STRING, allowNull: false, validate: { len: [2, 255] } },
    age: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 10, max: 100 } },
    email: { type: DataTypes.STRING, allowNull: false, validate: { len: [6, 255], isEmail: true } },
    gender: { type: DataTypes.STRING, allowNull: false, defaultValue: "male" },
    isConfirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
    
}, {
    tableName: "guests",
    timestamps: false,
});

module.exports = Guest;