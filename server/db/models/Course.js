const Sequelize = require('sequelize')
const db = require('../db')

const SALT_ROUNDS = 5

const Course = db.define('course', {
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    subject: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})

Course.findByTeacher = async function (teacherId) {
    const courses = await Course.findAll({
        where: { teacherId },
    })

    return courses
}

module.exports = Course
