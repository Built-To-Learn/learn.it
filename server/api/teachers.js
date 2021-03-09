const router = require('express').Router()
const { models: { Teacher }} = require('../db')

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await Teacher.findAll())
  } catch (ex) {
    next(ex)
  }
})

router.post('/', async (req, res, next) => {
  try {
    await Teacher.create(req.body)
    res.sendStatus(201)
  } catch (ex) {
    next(ex)
  }
})

router.get("/:teacherId", async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({
      where: { id: req.params.teacherId }
    })

    res.status(200).json(teacher)
  } catch (ex) {
    next(ex)
  }
})

router.put('/:teacherId', async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({
      where: { id: req.params.teacherId }
    })

    await teacher.update(req.body)
    res.sendStatus(204)
  } catch (error) {
    next(ex)
  }
})

router.delete('/:teacherId', async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({
      where: { id: req.params.teacherId }
    })

    await teacher.destroy()
    res.sendStatus(204)
  } catch (error) {
    next(ex)
  }
})

module.exports = router
