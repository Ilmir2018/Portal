const express = require('express')
const controller = require('../controllers/widgets')
const router = express.Router()
const passport = require('passport')
const admin = require('../middleware/adminMiddleware')


router.get('/', passport.authenticate('jwt', {session: false}), controller.get)
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getWidget)
router.post('/', passport.authenticate('jwt', {session: false}), admin(["ADMIN"]), controller.createContainerAndElements)
router.post('/add', passport.authenticate('jwt', {session: false}), admin(["ADMIN"]), controller.createNewWidget)
router.post('/deleteElem', passport.authenticate('jwt', {session: false}), admin(["ADMIN"]), controller.deleteElementAndWidgets)
router.post('/deleteCont', passport.authenticate('jwt', {session: false}), controller.deleteContainer)

module.exports = router