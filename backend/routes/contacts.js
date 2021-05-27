const express = require('express')
const controller = require('../controllers/contacts')
const router = express.Router()
const passport = require('passport')

router.get('/', passport.authenticate('jwt', {session: false}), controller.get)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete)

module.exports = router