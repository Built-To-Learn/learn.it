const router = require('express').Router()
const { models: { Question, User } } = require('../db')

router.get('/:courseId', async (req, res, next) => {
    try {
        const questions = await Question.findAll({
            where: {
               courseId: req.params.courseId 
            },
            includes: [ User ]
        })

        res.send(questions)
    }
    catch (error) {
        next(error)
    }
})

router.post('/create', async (req, res, next) => {
    try {
         const question = await Question.create(req.body)

         res.status(201).send(question)
    }
    catch (error) {
        next(error)
    }
})

router.delete('/delete/:questionId', async (req, res, next) => {
    try {
        const question = await Question.findOne({
            where: {
                id: req.params.questionId
            }
        })

        await question.destroy();
        
        res.sendStatus(204)
    }
    catch (error) {
        next(error)
    }
})

module.exports = router;