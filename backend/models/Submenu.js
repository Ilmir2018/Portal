const mongoose = require('mongoose')
const Menu = require('./Menu')
const Schema = mongoose.Schema

const submenuSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    url:{
        type: String,
        required: true
    },
    subtitle: {
        type: Object,
    }
})

module.exports = mongoose.model('submenus', submenuSchema)