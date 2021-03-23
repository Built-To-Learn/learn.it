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

//////// STRIPE ROUTES HERE ////////
router.get('/stripe/:acc', async (req, res, next) => {
    try {
        const account = await stripe.accounts.retrieve(req.params.acc);
        res.send(account)
    } catch (ex) {
        next(ex)
    }
})

router.get('/stripe/balance/:acc', async (req, res, next) => {
    try {
        const balance = await stripe.balance.retrieve({
            stripeAccount: req.params.acc
        });

        res.send(balance)
    } catch (ex) {
        next(ex)
    }
})

router.post('/stripe/payout/:acc', async (req, res, next) => {
    try {
        const { amount } = req.body
        const payout = await stripe.payouts.create({
            amount,
            currency: 'usd',
          }, {
            stripeAccount: req.params.acc,
          });

        res.send(payout)
    } catch (ex) {
        next(ex)
    }
})

// manually signup user for stripe if it failed when signup for platform
router.post('/stripe', async (req, res, next) => {
    const { id, email } = req.body
    const user = await User.findOne({ where: { id } })

    const account = await stripe.accounts.create({
        type: 'express',
        email
    });

    user.stripeAcc = account.id
    await user.save()
    res.sendStatus(204)
})

// create an onboarding link for new accounts
router.post("/stripe/accountlink", async (req, res, next) => {
    try {
        const { stripeAcc } = req.body
        const accountLink = await stripe.accountLinks.create({
            account: stripeAcc,
            refresh_url: 'http://localhost:8080/reauth',
            return_url: 'http://localhost:8080/home',
            type: 'account_onboarding',
        });

        res.send(accountLink)
    } catch (ex) {
        next(ex)
    }
})

router.post('/stripe/checkout', async (req, res, next) => {
    try {
        const {items, destination} = req.body
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items,
            payment_intent_data: {
              transfer_data: {
                destination
              }
            },
            success_url: 'http://localhost:8080/success/home',
            cancel_url: 'http://localhost:8080/reauth'
        })

        res.send(session)
    } catch (ex) {
        next(ex)
    }
})

module.exports = router
