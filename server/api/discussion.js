const router = require('express').Router();

const {
  db,
  models: { Course, User, Schedule, Discussion },
} = require('../db');
const { Op } = db.Sequelize;

router.get('/:id', async (req, res, next) => {
  try {
    const discussion = await Discussion.findAll({
      where: {
        courseId: req.params.id,
      },
      include: [User],
      order: [['createdAt', 'ASC']],
    });
    res.send(discussion);
  } catch (ex) {
    next(ex);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    const discussion = await Discussion.create({
      text: req.body.text,
      userId: user.id,
      courseId: req.body.courseId,
    });

    const fullPost = await Discussion.findOne({
      where: {
        id: discussion.id,
      },
      include: [User],
    });
    res.status(201).send(fullPost);
  } catch (ex) {
    next(ex);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);

    await Discussion.update(
      { text: req.body.text },
      {
        where: {
          id: parseInt(req.body.postId),
          userId: user.id,
        },
      }
    );

    const fullPost = await Discussion.findOne({
      where: {
        id: parseInt(req.body.postId),
      },
      include: [User],
    });

    res.status(201).send(fullPost);
  } catch (ex) {
    next(ex);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    await Discussion.destroy({
      where: {
        id: req.params.id,
        userId: user.id,
      },
    });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
