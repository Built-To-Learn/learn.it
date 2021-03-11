const { Sequelize, INTEGER } = require('sequelize')
const db = require('./db')

const User = require('./models/user')
const Course = require('./models/Course')

// Through Table
const Enrollment = db.define('enrollment', {
    courseId: INTEGER,
})

Enrollment.findCourseByStudent = async function (studentId) {
    const courses = await Enrollment.findAll({
        where: { studentId },
        include: [Course],
    })

    return courses
}
//

// Associations
Course.belongsTo(User)

Course.belongsToMany(User, { through: Enrollment })
User.belongsToMany(Course, { through: Enrollment })

Course.hasMany(Enrollment)
Enrollment.belongsTo(Course)
User.hasMany(Enrollment)
Enrollment.belongsTo(User)

const syncAndSeed = async () => {
    await db.sync({ force: true })
    const [cody, murphy, sal] = await Promise.all([
        User.create({
            name: 'Cody',
            username: 'cody123',
            email: 'cody@email.com',
            password: '123',
        }),
        User.create({
            name: 'Murphy',
            username: 'murphy123',
            email: 'murphy@email.com',
            password: '123',
        }),
        User.create({
            name: 'Sal',
            username: 'Sal123',
            email: 'Sal@email.com',
            password: '123',
            role: 'TEACHER',
        }),
    ])

    const [geometry, basketweaving, coding] = await Promise.all([
        Course.create({
            title: 'Geometry',
            subject: 'Math',
            category: 'Traditional Schoolwork',
        }),
        Course.create({
            title: 'Basket Weaving 101',
            subject: 'For Fun',
            category: 'Arts and Crafts',
        }),
        Course.create({
            title: 'Intro to Javascript',
            subject: 'Coding',
            category: 'Programming',
        }),
    ])

    return {
        students: {
            cody,
            murphy,
            sal,
        },

        courses: {
            geometry,
            basketweaving,
            coding,
        },
    }
}

module.exports = {
    db,
    syncAndSeed,
    models: {
        Course,
        Enrollment,
        User,
    },
}
