const express = require('express')
const controller = require('../controllers/contacts')
const router = express.Router()
const passport = require('passport')
const admin = require('../middleware/adminMiddleware')

router.get('/', passport.authenticate('jwt', {session: false}), controller.get)
router.get('/:id', passport.authenticate('jwt', {session: false}), admin(["ADMIN"]), controller.getById)
router.post('/', passport.authenticate('jwt', {session: false}), admin(["ADMIN"]), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), admin(["ADMIN"]), controller.update)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete)

module.exports = router