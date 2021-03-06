//this is the access point for all things database related!
const db = require('./db')

const User = require('./models/user')
const Teacher = require('./models/Teacher')
const Course = require('./models/Course')
const Student = require('./models/Student')
const { INTEGER } = require('sequelize')

const Sequelize = require('sequelize')
//associations could go here!

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

Course.belongsTo(Teacher)
Course.belongsToMany(Student, {
    through: Enrollment
})
Student.belongsToMany(Course, {
    through: Enrollment
})
Enrollment.belongsTo(Course)
Enrollment.belongsTo(Student)

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

    const [jake] = await Promise.all([
        Teacher.create({
            name: 'Jake',
            username: 'jake123',
            email: 'jake@email.com',
            password: '123',
        }),
    ])

    const mathclass = await Course.create({
        title: 'Math for fun',
        subject: 'Math Subject',
        category: 'Math Category',
        teacherId: jake.id,
    })

    await Enrollment.create({
        studentId: cody.id,
        courseId: mathclass.id,
    })

    const jakesClasses = await Course.findByTeacher(jake.id)
    const codyCourses = await Enrollment.findCourseByStudent(cody.id)
    console.log(JSON.stringify(codyCourses))

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
        Enrollment
    },
}
