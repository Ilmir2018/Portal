const express = require('express')
const controller = require('../controllers/widgets')
const router = express.Router()
const passport = require('passport')
const admin = require('../middleware/adminMiddleware')


router.get('/', passport.authenticate('jwt', {session: false}), controller.get)
router.get('/:id', passport.authenticate('jwt', {session: false}), admin(["ADMIN"]), controller.getById)

module.exports = router