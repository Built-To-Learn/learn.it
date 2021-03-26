const Sequelize = require('sequelize');
const db = require('../db');

const Schedule = db.define('schedule', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  start: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  end: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Schedule;
