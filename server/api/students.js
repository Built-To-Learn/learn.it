const router = require('express').Router()
const { models: { Student, Enrollment, Course }} = require('../db')

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await Student.findAll())
  } catch (ex) {
    next(ex)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, username, email , password} = req.body

    await Student.create({
      name,
      username,
      email,
      password
    })

    res.sendStatus(201)
  } catch (ex) {
    next(ex)
  }
})

router.get("/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findOne({
      where: { id: req.params.studentId },
      include: [
        {
          model: Enrollment,
          include: [ Course ]
        }
      ]
    })

    res.status(200).json(student)
  } catch (ex) {
    next(ex)
  }
})

router.put('/:studentId', async (req, res, next) => {
  try {
    const student = await Student.findOne({
      where: { id: req.params.studentId }
    })

    await student.update(req.body)
    res.sendStatus(204)
  } catch (error) {
    next(ex)
  }
})

router.delete('/:studentId', async (req, res, next) => {
  try {
    const student = await Student.findOne({
      where: { id: req.params.studentId }
    })

    await student.destroy()
    res.sendStatus(204)
  } catch (error) {
    next(ex)
  }
})

module.exports = router
