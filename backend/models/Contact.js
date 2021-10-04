const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
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
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    date: {
        type: Date,
        default: Date.now
    },
    roles: [{type: String, ref: 'Role'}],
    imageSrc: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('contacts', contactSchema)