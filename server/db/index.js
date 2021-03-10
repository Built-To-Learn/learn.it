const {Sequelize, INTEGER} = require('sequelize')
const db = require('./db')

const User = require('./models/user')
const Teacher = require('./models/Teacher')
const Course = require('./models/Course')
const Student = require('./models/Student')

// Through Table
const Enrollment = db.define('enrollment', {
    courseId: INTEGER,
})

Enrollment.findCourseByStudent = async function(studentId){
    const courses = await Enrollment.findAll({
        where: { studentId },
        include: [ Course ]
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
    const student = await Promise.all([
        User.create({
            name: 'Cody',
            username: 'cody123',
            email: 'cody@email.com',
            password: '123',
            role: "STUDENT"
        }),
        User.create({
            name: 'Murphy',
            username: 'murphy123',
            email: 'murphy@email.com',
            password: '123',
            role: "STUDENT"
        }),
        User.create({
            name: 'Sal',
            username: 'Sal123',
            email: 'Sal@email.com',
            password: '123',
            role: "TEACHER"
        }),
    ])
    const [cody, murphy, sal] = student

    return {
        students: {
            cody,
            murphy,
            sal,
        },
    }
}

module.exports = {
    db,
    syncAndSeed,
    models: {
        Student,
        Teacher,
        Course,
        Enrollment,
        User
    },
}
