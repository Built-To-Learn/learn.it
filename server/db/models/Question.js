const { TEXT, INTEGER } = require('sequelize')
const db = require('../db')

const Question = db.define('question', {
    text: {
        type: TEXT,
        allowNull: false
    },
    upvotes: {
        type: INTEGER
    }
})

module.exports = Question