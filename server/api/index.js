const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/enrollments', require('./enrollments'));
router.use('/courses', require('./courses'));
router.use('/questions', require('./questions'));
router.use('/schedule', require('./schedule'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

module.exports = router;
