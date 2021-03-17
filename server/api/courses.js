const router = require('express').Router()
const {
    db,
    models: { Course, Teacher, User },
} = require('../db')
const { Op } = db.Sequelize

router.get('/user', async (req, res, next) => {
    try {
        const user = await User.findByToken(req.headers.authorization)
        const courses = await Course.findAll({
            where: { userId: user.id },
        })
        res.send(courses)
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
        console.log('USERID', user.id)
        res.status(201).send(user.id)
    } catch (ex) {
        next(ex)
    }
})

router.get('/courseSearch/:search', async (req, res, next) => {
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
