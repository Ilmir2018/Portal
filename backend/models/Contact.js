const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactSchema = new Schema({
    tab_num: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
    },
    division: {
        type: String,
    },
    city: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
    },
    status: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('contacts', contactSchema)