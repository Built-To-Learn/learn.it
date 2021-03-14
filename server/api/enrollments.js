const router = require('express').Router()
const {
    models: { Enrollment, Student, Course },
} = require('../db')

router.get('/', async (req, res, next) => {
    try {
        res.status(200).json(
            await Enrollment.findAll({
                include: [Course],
            })
        )
    } catch (ex) {
        next(ex)
    }
})

router.post('/', async (req, res, next) => {
    try {
        await Enrollment.create(req.body)
        res.sendStatus(201)
    } catch (ex) {
        next(ex)
    }
})

router.get('/:userId', async (req, res, next) => {
    try {
        const enrollments = await Enrollment.findAll({
            include: [Course],
            where: { userId: req.params.userId },
        })

        res.status(200).json(enrollments)
    } catch (ex) {
        next(ex)
    }
})

router.delete('/:userId/:courseId', async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findAll({
            where: {
                userId: req.params.userId,
                courseId: req.params.courseId,
            },
        })

        await enrollment.destroy()

        res.sendStatus(204)
    } catch (ex) {
        next(ex)
    }
})

module.exports = router
