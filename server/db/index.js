//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/user')
const Teacher = require('./models/Teacher')
const Class = require('./models/class')
const Student = require('./models/Student')
const { INTEGER } = require('sequelize')

const Sequelize = require('sequelize')
//associations could go here!
const Enrollment = db.define('enrollment', {
    classId: INTEGER,
})

Class.belongsToMany(Student, {
    through: Enrollment,
    foreignKey: 'classId',
})
Student.belongsToMany(Class, {
    through: Enrollment,
    foreignKey: 'studentId',
})

Class.belongsTo(Teacher)

const syncAndSeed = async () => {
    await db.sync({ force: true })
    const student = await Promise.all([
        Student.create({
            name: 'Cody',
            username: 'cody123',
            email: 'cody@email.com',
            password: '123',
        }),
        Student.create({
            name: 'Murphy',
            username: 'murphy123',
            email: 'murphy@email.com',
            password: '123',
        }),
        Student.create({
            name: 'Sal',
            username: 'Sal123',
            email: 'Sal@email.com',
            password: '123',
        }),
    ])
    const [cody, murphy, sal] = student

    const teacher = await Promise.all([
        Teacher.create({
            name: 'Jake',
            username: 'jake123',
            email: 'jake@email.com',
            password: '123',
        }),
    ])

    const [jake] = teacher

    const mathclass = await Class.create({
        title: 'Math for fun',
        subject: 'Math Subject',
        category: 'Math Category',
        teacherId: jake.id,
    })

    await Enrollment.create({
        studentId: cody.id,
        classId: mathclass.id,
    })

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
    },
}
