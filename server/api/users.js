const router = require('express').Router()
const { models: { User }} = require('../db')

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await User.findAll())
  } catch (ex) {
    next(ex)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, username, email , password} = req.body

    await User.create({
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

router.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId }
    })

    res.status(200).json(user)
  } catch (ex) {
    next(ex)
  }
})

router.put('/:userId', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId }
    })

    await user.update(req.body)
    res.sendStatus(204)
  } catch (error) {
    next(ex)
  }
})

router.delete('/:userId', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId }
    })

    await user.destroy()
    res.sendStatus(204)
  } catch (error) {
    next(ex)
  }
})

module.exports = router

