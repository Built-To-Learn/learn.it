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
Course.belongsTo(Teacher)

Course.belongsToMany(Student, { through: Enrollment })
Student.belongsToMany(Course, { through: Enrollment})

Course.hasMany(Enrollment)
Enrollment.belongsTo(Course)
Student.hasMany(Enrollment)
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

    const [jake, prof] = await Promise.all([
        Teacher.create({
            name: 'Jake',
            username: 'jake123',
            email: 'jake@email.com',
            password: '123',
        }),
        Teacher.create({
            name: 'Prof',
            username: 'profMan333',
            email: 'prof@email.com',
            password: '123',
        })
    ])

    const [mathclass, woodWorking ] = await Promise.all([
        Course.create({
            title: 'Math for fun',
            subject: 'Math Subject',
            category: 'Math Category',
            teacherId: jake.id,
        }),
        Course.create({
            title: 'Building A Table',
            subject: 'Woodworking',
            category: 'Building',
            teacherId: prof.id,
        })
    ])

    await Enrollment.create({
        studentId: cody.id,
        courseId: mathclass.id,
    })

    await Enrollment.create({
        studentId: cody.id,
        courseId: woodWorking.id,
    })

    await Enrollment.create({
        studentId: sal.id,
        courseId: woodWorking.id,
    })

    // method testing
    const jakesClasses = await Course.findByTeacher(jake.id)
    const codyCourses = await Enrollment.findCourseByStudent(cody.id)
    const salCourses = await Enrollment.findCourseByStudent(sal.id)

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
        Enrollment
    },
}
