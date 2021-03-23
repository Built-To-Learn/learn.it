const router = require('express').Router();
const {
  db,
  models: { Course, User, Schedule },
} = require('../db');
const { Op } = db.Sequelize;

router.post('/createEvent', async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    const course = await Course.findByPk(req.body.course.id);

    if (course.userId === user.id) {
      const event = await Schedule.create({
        start: req.body.schedule.start,
        end: req.body.schedule.end,
        courseId: req.body.course.id,
      });

      // console.log(event);
      res.send(event);
    }
  } catch (ex) {
    next(ex);
  }
});

router.post('/deleteEvent', async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    const course = await Course.findByPk(req.body.courseId);

    if (course.userId === user.id) {
      await Schedule.destroy({
        where: {
          id: req.body.id,
        },
      });
    }
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
