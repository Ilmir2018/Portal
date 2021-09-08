const express = require('express')
const router = express.Router()
const passport = require('passport')
const controller = require('../controllers/menu')

router.get('/', passport.authenticate('jwt', {session: false}), controller.get)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)

module.exports = router