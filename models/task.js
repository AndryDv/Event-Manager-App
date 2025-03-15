const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Task = sequelize.define(
  "Task",
  {
    task: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 255],
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isDone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    toEvent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Events",
        key: "id",
      },
    },
  },
  {
    tableName: "tasks",
    timestamps: false,
  }
);

module.exports = Task;
