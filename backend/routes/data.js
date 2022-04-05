const express = require('express')
const router = express.Router()
const passport = require('passport')
const controller = require('../controllers/data')

router.get('/data', passport.authenticate('jwt', {session: false}), controller.getData)

router.get('/table', passport.authenticate('jwt', {session: false}), controller.getTable)

router.get('/', passport.authenticate('jwt', {session: false}), controller.get)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.post('/types', passport.authenticate('jwt', {session: false}), controller.createField)
router.post('/data', passport.authenticate('jwt', {session: false}), controller.addUpdateField)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete)

module.exports = router