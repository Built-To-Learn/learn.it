const router = require('express').Router()
const fetch = require("node-fetch")
const axios = require("axios")
const stripe = require('stripe')(process.env.STRIPE_SK_TEST)
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
        // create stripe user
        const account = await stripe.accounts.create({
            type: 'express',
            email: req.body.email
        });

        req.body.stripeAcc = account.id
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

// create an onboarding link for new accounts
router.post("/stripe/accountlink", async (req, res, next) => {
    try {
        const { stripeAcc } = req.body
        const accountLink = await stripe.accountLinks.create({
            account: stripeAcc,
            refresh_url: 'https://localhost:8080/reauth',
            return_url: 'https://localhost:8080/success',
            type: 'account_onboarding',
        });

        res.send(accountLink)
    } catch (ex) {
        next(ex)
    }
})

module.exports = router
