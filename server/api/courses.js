const router = require('express').Router()
const {
    db,
    models: { Course, Teacher, User },
} = require('../db')
const { Op } = db.Sequelize

router.get('/:search', async (req, res, next) => {
    try {
        const courses = await Course.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${req.params.search}%`,
                },
            },
            order: [['title', 'ASC']],
            limit: 20,
        })
        res.status(200).send(courses)
    } catch (ex) {
        next(ex)
    }
})

router.get('/', async (req, res, next) => {
    try {
        res.status(200).json(await Course.findAll())
    } catch (ex) {
        next(ex)
    }
})

router.post('/', async (req, res, next) => {
    try {
        console.log('REQ.BODY', req.body)
        const user = await User.findByToken(req.headers.authorization)
        req.body.userId = user.id
        await Course.create(req.body)
        res.sendStatus(201)
    } catch (ex) {
        next(ex)
    }
})

router.get('/:courseId', async (req, res, next) => {
    try {
        const course = await Course.findOne({
            include: [Teacher],
            where: { id: req.params.courseId },
        })
    } catch (ex) {
        next(ex)
    }
})

router.get('/user', async (req, res, next) => {
    try {
        console.log('INSIDE ROUTE')
        // const user = await User.findByToken(req.headers.authorization)
        // const courses = await Course.findAll({
        //     where: { userId: req.params.userId },
        // })
        res.send(200).json('courses')
    } catch (ex) {
        console.log('ERRRROR')
        next(ex)
    }
})

router.put('/:courseId', async (req, res, next) => {
    try {
        const course = await Course.findOne({
            where: { id: req.params.courseId },
        })

        await course.update(req.body)
        res.sendStatus(204)
    } catch (error) {
        next(ex)
    }
})

router.delete('/:courseId', async (req, res, next) => {
    try {
        const course = await Course.findOne({
            where: { id: req.params.courseId },
        })

        await course.destroy()
        res.sendStatus(204)
    } catch (error) {
        next(ex)
    }
})

module.exports = router
