const { Sequelize, INTEGER } = require('sequelize');
const db = require('./db');

const User = require('./models/user');
const Course = require('./models/Course');
const Question = require('./models/Question');
const Schedule = require('./models/Schedule');
const Like = require('./models/Like');
const Discussion = require('./models/Discussion');

// Through Table
const Enrollment = db.define('enrollment', {
  courseId: INTEGER,
});

Enrollment.findCourseByStudent = async function (studentId) {
  const courses = await Enrollment.findAll({
    where: { studentId },
    include: [Course],
  });

  return courses;
};
//

Schedule.belongsTo(Course);
Course.hasMany(Schedule);

// Associations
Course.belongsTo(User);

Course.belongsToMany(User, { through: Enrollment });
User.belongsToMany(Course, { through: Enrollment });

User.hasMany(Discussion);
Discussion.belongsTo(User);
Course.hasMany(Discussion);
Discussion.belongsTo(Course);

Course.hasMany(Enrollment);
Enrollment.belongsTo(Course);
User.hasMany(Enrollment);
Enrollment.belongsTo(User);
Course.hasMany(Question);
Question.belongsTo(Course);
User.hasMany(Question);
Question.belongsTo(User);
User.hasMany(Like);
Like.belongsTo(User);
Question.hasMany(Like);
Like.belongsTo(Question);

const syncAndSeed = async () => {
  await db.sync({ force: true });
  const [cody, murphy, sal, admin] = await Promise.all([
    User.create({
      name: 'Cody',
      username: 'cody123',
      email: 'cody@email.com',
      password: '123',
      role: 'TEACHER'
    }),
    User.create({
      name: 'Murphy',
      username: 'murphy123',
      email: 'murphy@email.com',
      password: '123',
    }),
    User.create({
      name: 'Sal',
      username: 'Sal123',
      email: 'Sal@email.com',
      password: '123',
      role: 'TEACHER',
    }),
    User.create({
      name: 'admin',
      username: 'admin',
      email: 'admin@email.com',
      password: '123',
      onboarded: true,
      stripeAcc: 'acct_1IXbI3PtzjF0VE0i',
      role: 'TEACHER',
    }),
    User.create({
      name: 'bob',
      username: 'batmanAndBobin',
      email: 'bob@email.com',
      password: '123',
      onboarded: true,
      stripeAcc: 'acct_1IXZZGQ1nM9zmUEJ',
    }),
  ]);

  const [
    geometry,
    basketweaving,
    coding,
    math,
    stocks,
    clown,
  ] = await Promise.all([
    Course.create({
      title: 'Geometry',
      category: 'Traditional Schoolwork',
      userId: cody.id,
      description:
        'Geometry is a branch of mathematics that studies the sizes, shapes, positions angles and dimensions of things. Flat shapes like squares, circles, and triangles are a part of flat geometry and are called 2D shapes. These shapes have only 2 dimensions, the length and the width.',
      slogan: 'Geometry is just plane fun.',
      coursePicURL: 'https://images.theconversation.com/files/355476/original/file-20200831-14-174eny.jpg?ixlib=rb-1.1.0&rect=5%2C214%2C3480%2C1740&q=45&auto=format&w=668&h=324&fit=crop'  
    }),
    Course.create({
      title: 'Basket Weaving 101',
      category: 'Arts and Crafts',
      userId: cody.id,
      description:
        'Basket weaving is the process of weaving or sewing pliable materials into three-dimensional artifacts, such as baskets, mats, mesh bags or even furniture. Craftspeople and artists specialized in making baskets may be known as basket makers and basket weavers. Basket weaving is also a rural craft. ',
      slogan: 'Who said basketweaving was useless? Learn to make a basket!',
      coursePicURL: "https://cimg2.ibsrv.net/cimg/www.davesgarden.com/700x312_100-1/226/Basketweaving-488226.png"
    }),
    Course.create({
      title: 'Intro to Javascript',
      category: 'Programming',
      userId: cody.id,
      description:
        'JavaScript is the most popular programming language for both front-end and back-end web development. Applications for JavaScript span from interactive websites to the Internet of Things, making it a great choice for beginners and experienced developers looking to learn a new programming language.',
      slogan: 'Dive in head first to modern web development!',
      coursePicURL: "https://miro.medium.com/max/800/1*bxEkHw1xewxOFjmGunb-Cw.png" 
    }),
    Course.create({
      title: 'Math is Fun',
      category: 'School',
      userId: cody.id,
      description: 'Hooray for Math',
      slogan: 'Without mathematics, there’s nothing you can do. Everything around you is mathematics. Everything around you is numbers.',
      coursePicURL: "https://www.studymumbai.com/wp-content/uploads/math-is-fun.jpg"
    }),
    Course.create({
      title: 'Investing',
      category: 'School',
      userId: cody.id,
      description:
        'Build your knowledge of investing with our self-study course covering stocks, funds, ETFs, bonds, and portfolio construction.',
      slogan: 'A richer journey that leads to success.',
      coursePicURL: "https://www.usnews.com/dims4/USNEWS/9c2e3d4/2147483647/thumbnail/640x420/quality/85/?url=http%3A%2F%2Fmedia.beam.usnews.com%2F90%2F8d%2F67684dfc437ea17ab3a0832a7343%2F191002-volatility-stock.jpg"
    }),
    Course.create({
      title: 'Become A Professional Clown',
      category: 'Clown School',
      userId: murphy.id,
      description:
        "Clowning is a noble calling. In the Udemy course, Clown for fun and profit: Learning the art of clowning, you'll be steeped in the ancient art and history of clowning. You get to pick a wig and clown outfit, find your clown's personality, and learn how to actually make a living as a professional clown. It's not all balloons and birthday parties, folks.",
      slogan: "Who needs traditional education. We'll teach you how to become a professional clown and join the circus!",
      coursePicURL: "https://ih1.redbubble.net/image.903694108.7336/st,small,507x507-pad,600x600,f8f8f8.jpg"
    }),
    Course.create({
      title: 'Pay me!',
      category: 'Enrichment',
      userId: admin.id,
      description: 'Give me money',
      slogan: "Hey, donate today!",
      coursePicURL: "http://www.reactiongifs.com/r/jlpm.gif"
    }),
  ]);

  await Question.create({
    text: 'Test',
    upvotes: 5,
    userId: cody.id,
    courseId: geometry.id,
  });

  await Question.create({
    text: 'Test',
    upvotes: 5,
    userId: murphy.id,
    courseId: geometry.id,
  });

  await Question.create({
    text: 'Test',
    upvotes: 4,
    userId: sal.id,
    courseId: geometry.id,
  });

  await Question.create({
    text: 'Test',
    upvotes: 5,
    userId: cody.id,
    courseId: geometry.id,
  });

  await Question.create({
    text: 'Test',
    upvotes: 5,
    userId: murphy.id,
    courseId: geometry.id,
  });

  await Question.create({
    text: 'Test',
    upvotes: 4,
    userId: sal.id,
    courseId: geometry.id,
  });

  await Question.create({
    text: 'Test',
    upvotes: 5,
    userId: cody.id,
    courseId: geometry.id,
  });

  await Question.create({
    text: 'Test',
    upvotes: 5,
    userId: murphy.id,
    courseId: geometry.id,
  });

  await Question.create({
    text: 'Test',
    upvotes: 4,
    userId: sal.id,
    courseId: geometry.id,
  });

  await Discussion.create({
    text: 'Test1',
    userId: sal.id,
    courseId: geometry.id,
  });

  await Discussion.create({
    text: 'Another post',
    userId: sal.id,
    courseId: geometry.id,
  });

  return {
    students: {
      cody,
      murphy,
      sal,
    },
    courses: {
      math,
      stocks,
      clown,
      geometry,
      basketweaving,
      coding,
    },
  };
};

module.exports = {
  db,
  syncAndSeed,
  models: {
    Course,
    Enrollment,
    User,
    Question,
    Schedule,
    Like,
    Discussion,
  },
};
