const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    tab_num: {
        type: Number,
        required: true,
        unique: true
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
    firm: {
        type: String,
        required: true
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
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('contacts', contactSchema)