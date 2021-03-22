const { Sequelize, INTEGER } = require('sequelize')
const db = require('./db')

const User = require('./models/User');
const Course = require('./models/Course');
const Question = require('./models/Question');

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

Course.hasMany(Enrollment);
Enrollment.belongsTo(Course);
User.hasMany(Enrollment);
Enrollment.belongsTo(User);
Course.hasMany(Question);
Question.belongsTo(Course);
User.hasMany(Question);
Question.belongsTo(User);

const syncAndSeed = async () => {
    await db.sync({ force: true })
    const [cody, murphy, sal, admin] = await Promise.all([
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
        User.create({
            name: 'admin',
            username: 'admin',
            email: 'admin@email.com',
            password: '123',
            onboarded: true,
            stripeAcc: 'acct_1IXbI3PtzjF0VE0i',
            role: 'TEACHER'
        }),
        User.create({
            name: 'bob',
            username: 'batmanAndBobin',
            email: 'bob@email.com',
            password: '123',
            onboarded: true,
            stripeAcc: 'acct_1IXZZGQ1nM9zmUEJ',
        })
    ])

    const [
        geometry,
        basketweaving,
        coding,
        math,
        stocks,
        clown,
    ] = await Promise.all([
        Course.create({
            title: 'Geometry',
            category: 'Traditional Schoolwork',
            userId: cody.id,
            description:
                'Geometry is a branch of mathematics that studies the sizes, shapes, positions angles and dimensions of things. Flat shapes like squares, circles, and triangles are a part of flat geometry and are called 2D shapes. These shapes have only 2 dimensions, the length and the width.',
        }),
        Course.create({
            title: 'Basket Weaving 101',
            category: 'Arts and Crafts',
            userId: cody.id,
            description:
                'Basket weaving is the process of weaving or sewing pliable materials into three-dimensional artifacts, such as baskets, mats, mesh bags or even furniture. Craftspeople and artists specialized in making baskets may be known as basket makers and basket weavers. Basket weaving is also a rural craft. ',
        }),
        Course.create({
            title: 'Intro to Javascript',
            category: 'Programming',
            userId: cody.id,
            description:
                'JavaScript is the most popular programming language for both front-end and back-end web development. Applications for JavaScript span from interactive websites to the Internet of Things, making it a great choice for beginners and experienced developers looking to learn a new programming language.',
        }),
        Course.create({
            title: 'Math is fun',
            category: 'School',
            userId: cody.id,
            description: 'Hooray for Math',
        }),
        Course.create({
            title: 'Investing',
            category: 'School',
            userId: cody.id,
            description:
                'Build your knowledge of investing with our self-study course covering stocks, funds, ETFs, bonds, and portfolio construction.',
        }),
        Course.create({
            title: 'Become A Professional Clown',
            category: 'Clown School',
            userId: murphy.id,
            description:
                "Clowning is a noble calling. In the Udemy course, Clown for fun and profit: Learning the art of clowning, you'll be steeped in the ancient art and history of clowning. You get to pick a wig and clown outfit, find your clown's personality, and learn how to actually make a living as a professional clown. It's not all balloons and birthday parties, folks.",
        }),
        Course.create({
            title: 'Pay me!',
            category: 'Enrichment',
            userId: admin.id,
            description: 'Give me money',
        })
    ])

    await Question.create({
        text: 'Test',
        upvotes: 5,
        userId: cody.id,
        courseId: geometry.id
    })

    await Question.create({
        text: 'Test',
        upvotes: 5,
        userId: murphy.id,
        courseId: geometry.id
    })

    await Question.create({
        text: 'Test',
        upvotes: 4,
        userId: sal.id,
        courseId: geometry.id
    })

    await Question.create({
        text: 'Test',
        upvotes: 5,
        userId: cody.id,
        courseId: geometry.id
    })

    await Question.create({
        text: 'Test',
        upvotes: 5,
        userId: murphy.id,
        courseId: geometry.id
    })

    await Question.create({
        text: 'Test',
        upvotes: 4,
        userId: sal.id,
        courseId: geometry.id
    })

    await Question.create({
        text: 'Test',
        upvotes: 5,
        userId: cody.id,
        courseId: geometry.id
    })

    await Question.create({
        text: 'Test',
        upvotes: 5,
        userId: murphy.id,
        courseId: geometry.id
    })

    await Question.create({
        text: 'Test',
        upvotes: 4,
        userId: sal.id,
        courseId: geometry.id
    })

    return {
        students: {
            cody,
            murphy,
            sal,
        },
        courses: {
            math,
            stocks,
            clown,
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
        Question
    },
}
