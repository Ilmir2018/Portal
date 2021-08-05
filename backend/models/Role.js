const mongoose = require("mongoose");
const Schema = mongoose.Schema

const roleSchema = new Schema({
    value: {
        type: String,
        unique: true,
        default: 'USER'
    }
})

module.exports = mongoose.model('roles', roleSchema);