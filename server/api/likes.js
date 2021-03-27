const router = require('express').Router()
const {
    models: { Like },
  } = require('../db');

  router.post('/create', async (req, res, next) => {
      try {
        const like = await Like.create(req.body)

        res.status(201).send(like)
      } catch (error) {
          next(error)
      }
  })

  router.delete('/delete', async (req, res, next) => {
      try {
        const like = await Like.findOne({ where: req.body })

        await like.destroy();

        res.sendStatus(204);
      } catch (error) {
        next(error)
      }
  })

  module.exports = router;