const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')


const authRoutes = require('./routes/auth')
const contactsRoutes = require('./routes/contacts')
const keys= require('./config/keys')
const app = express()

mongoose.connect(keys.MONGO_UTI, {useUnifiedTopology: true, useNewUrlParser: true})
.then(() => {console.log('MongoDb connected')})
.catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'))
app.use(require('cors')())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactsRoutes)

module.exports = app