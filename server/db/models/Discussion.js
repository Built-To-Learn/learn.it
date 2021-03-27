const { TEXT } = require('sequelize');
const db = require('../db');

const Discussion = db.define('discussion', {
  text: {
    type: TEXT,
  },
});

module.exports = Discussion;
