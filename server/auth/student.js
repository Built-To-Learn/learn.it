const router = require('express').Router()
const {
    models: { Student },
} = require('../db')

router.post('/login', async (req, res, next) => {
    try {
        res.send({ token: await Student.authenticate(req.body) })
    } catch (err) {
        next(err)
    }
})

//github callback if using github OAUTH
router.get('/github/callback', async (req, res, next) => {
    //User.authenticateGithub will attempt to use code to find a user in our system.
    //if successful, a jwt token will be returned
    //that token will be set in localStorage
    //and client will redirect to home page
    try {
        res.send(
            `
      <html>
      <body>
        <script>
        window.localStorage.setItem('token', '${await Student.authenticateGithub(
            req.query.code
        )}');
        window.document.location = '/';
        </script>
      </body>
      </html>
      `
        )
    } catch (ex) {
        next(ex)
    }
})

router.post('/signup', async (req, res, next) => {
    try {
        const student = await Student.create(req.body)
        res.send({ token: await student.generateToken() })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(401).send('Student already exists')
        } else {
            next(err)
        }
    }
})

router.get('/me', async (req, res, next) => {
    try {
        console.log('TOKEN', req.headers.authorization)
        res.send(await Student.findByToken(req.headers.authorization))
    } catch (ex) {
        next(ex)
    }
})

module.exports = router
