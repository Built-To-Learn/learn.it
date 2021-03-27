const router = require('express').Router()
const {
    models: { Question, User, Like },
  } = require('../db');

router.get('/:courseId', async (req, res, next) => {
    try {
        const questions = await Question.findAll({
            where: {
               courseId: req.params.courseId 
            },
            include: [ User, Like ]
        })

        res.send(questions)
    } catch (error) {
        next(error)
    }
})

router.get('/question/:questionId', async (req, res, next) => {
    try {
        const question = await Question.findOne({
            where: {
                id: req.params.questionId
            },
            include: [ User, Like ]
        })

        res.send(question)
    } catch (error) {
        next(error)
    }
})

router.post('/create', async (req, res, next) => {
    try {
        const id = (await Question.create(req.body)).id

        const question = await Question.findOne({
            where: {
                id: id
            },
            include: [ User, Like ]
        })

        res.status(201).send(question)
    } catch (error) {
        next(error)
    }
})

router.put('/update/:questionId', async (req, res, next) => {
    try {
        let question = await Question.findOne({
            where: {
                id: req.params.questionId
            }
        })

        question.upvotes = question.upvotes + req.body.modifier

        await question.save();

        question = await Question.findOne({
            where: {
                id: req.params.questionId
            },
            include: [ User, Like ]
        })

        res.send(question)
    } catch (error) {
        next(error)
    }
})

router.delete('/delete/:questionId', async (req, res, next) => {
    try {
        const question = await Question.findOne({
            where: {
                id: req.params.questionId,
            }
        })

        await question.destroy()

        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

module.exports = router;
