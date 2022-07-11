const express = require('express')
const controller = require('../controllers/widgets')
const router = express.Router()
const passport = require('passport')
const admin = require('../middleware/adminMiddleware')


router.get('/', passport.authenticate('jwt', {session: false}), controller.get)
router.post('/', passport.authenticate('jwt', {session: false}), admin(["ADMIN"]), controller.createContainerAndElements)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.deleteElementAndWidgets)
router.delete('/container/:id', passport.authenticate('jwt', {session: false}), controller.deleteContainer)

module.exports = router