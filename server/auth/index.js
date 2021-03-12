const router = require('express').Router()
const fetch = require("node-fetch")
const axios = require("axios")
const {models: { User }} = require("../db")

router.post('/login', async (req, res, next) => {
    try {
        res.send({ token: await User.authenticate(req.body) })
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
        window.localStorage.setItem('token', '${await User.authenticateGithub(
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
        const user = await User.create(req.body)
        res.send({ token: await user.generateToken() })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(401).send('User already exists')
        } else {
            next(err)
        }
    }
})

router.get('/me', async (req, res, next) => {
    try {
        res.send(await User.findByToken(req.headers.authorization))
    } catch (ex) {
        next(ex)
    }
})

router.get('/paypaltoken', async (req, res, next) => {
    try {
        const url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
        const authStr = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        const base64 = Buffer.from(authStr).toString('base64')

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': `Basic ${base64}`,
            },
            body: 'grant_type=client_credentials'
        })
            .then(res => res.json())
            .then(data => res.send(data))
            .catch(ex => next(ex))
    } catch (ex) {
        next(ex)
    }

})

module.exports = router
