const router = require('express').Router()
const { models: { Course, Teacher }} = require('../db')

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await Course.findAll())
  } catch (ex) {
    next(ex)
  }
})

router.post('/', async (req, res, next) => {
  try {
    await Course.create(req.body)
    res.sendStatus(201)
  } catch (ex) {
    next(ex)
  }
})

router.get("/:courseId", async (req, res, next) => {
  try {
    const course = await Course.findOne({
      include: [ Teacher ],
      where: { id: req.params.courseId }
    })

    res.status(200).json(course)
  } catch (ex) {
    next(ex)
  }
})

router.put('/:courseId', async (req, res, next) => {
  try {
    const course = await Course.findOne({
      where: { id: req.params.courseId }
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
      where: { id: req.params.courseId }
    })

    await course.destroy()
    res.sendStatus(204)
  } catch (error) {
    next(ex)
  }
})

module.exports = router
