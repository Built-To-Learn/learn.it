const router = require('express').Router()

router.use('/users', require('./users'))
router.use('/students', require('./students'))
router.use('/teachers', require('./teachers'))
router.use('/enrollments', require('./enrollments'))
router.use('/courses', require('./courses'))

router.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

module.exports = router
