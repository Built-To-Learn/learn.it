const router = require('express').Router();
const {
  db,
  models: { Course, Teacher, User, Schedule },
} = require('../db');
const { Op } = db.Sequelize;

router.get('/user', async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    const courses = await Course.findAll({
      where: { userId: user.id },
      include: [Schedule, User],
    });
    res.send(courses);
  } catch (ex) {
    next(ex);
  }
});

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await Course.findAll({ include: [User, Schedule] }));
  } catch (ex) {
    next(ex);
  }
});

router.post('/', async (req, res, next) => {
  try {
    console.log('REQ.BODY', req.body);
    const user = await User.findByToken(req.headers.authorization);
    req.body.userId = user.id;
    const course = await Course.create(req.body);
    const courseWithUser = await Course.findOne({
      where: {
        id: course.id,
      },
      include: [User, Schedule],
    });
    res.status(201).send(courseWithUser);
  } catch (ex) {
    next(ex);
  }
});

router.get('/courseSearch/:search', async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      where: {
        title: {
          [Op.iLike]: `%${req.params.search}%`,
        },
      },
      order: [['title', 'ASC']],
      limit: 20,
      include: [Schedule, User],
    });
    res.status(200).send(courses);
  } catch (ex) {
    next(ex);
  }
});

router.get('/:courseId', async (req, res, next) => {
  try {
    const course = await Course.findOne({
      include: [Teacher, Schedule, User],
      where: { id: req.params.courseId },
    });
  } catch (ex) {
    next(ex);
  }
});

router.put('/:courseId', async (req, res, next) => {
  try {
    const course = await Course.findOne({
      where: { id: req.params.courseId },
      include: [Schedule, Teacher, User],
    });

    await course.update(req.body);
    res.sendStatus(204);
  } catch (error) {
    next(ex);
  }
});

router.delete('/:courseId', async (req, res, next) => {
  try {
    const course = await Course.findOne({
      where: { id: req.params.courseId },
    });

    await course.destroy();
    // does this need a save?
    res.sendStatus(204);
  } catch (error) {
    next(ex);
  }
});

module.exports = router;
