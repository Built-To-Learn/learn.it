const router = require('express').Router()
const {
    models: { Student },
} = require('../db')
module.exports = router

router.get('/students', async (req, res, next) => {
    try {
        const students = await Student.findAll({
            // explicitly select only the id and email fields - even though
            // users' passwords are encrypted, it won't help if we just
            // send everything to anyone who asks!
            attributes: ['id', 'email'],
        })
        res.json(students)
    } catch (err) {
        next(err)
    }
})
