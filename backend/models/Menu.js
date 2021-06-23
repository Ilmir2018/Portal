const mongoose = require('mongoose')
const Submenu = require('./Submenu')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: Submenu,
    }
})

module.exports = mongoose.model('menus', menuSchema)