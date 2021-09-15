const mongoose = require('mongoose')
const Submenu = require('./Submenu')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    subtitle: {
        type: Object
    }
})

module.exports = mongoose.model('menus', menuSchema)