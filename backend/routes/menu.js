const express = require('express')
const router = express.Router()
const passport = require('passport')
const controller = require('../controllers/menu')

router.get('/modal', passport.authenticate('jwt', {session: false}), controller.getPermissions)

router.get('/', passport.authenticate('jwt', {session: false}), controller.get)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete)

router.post('/modal', passport.authenticate('jwt', {session: false}), controller.modal)
router.post('/changeStructure', passport.authenticate('jwt', {session: false}), controller.changeStructure)

module.exports = router