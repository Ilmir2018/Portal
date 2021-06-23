const mongoose = require('mongoose')
const Menu = require('./Menu')
const Schema = mongoose.Schema

const submenuSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: Menu,
    }
})

module.exports = mongoose.model('submenus', submenuSchema)