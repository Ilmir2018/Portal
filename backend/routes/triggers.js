const express = require('express')
const controller = require('../controllers/triggers')
const router = express.Router()
const passport = require('passport')
const admin = require('../middleware/adminMiddleware')


router.get('/', passport.authenticate('jwt', {session: false}), controller.get)
router.post('/', passport.authenticate('jwt', {session: false}), admin(["ADMIN"]), controller.create)

module.exports = router


