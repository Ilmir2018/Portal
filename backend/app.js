const express = require('express')
const mongoose = require("mongoose");
const passport = require("passport")
const path = require("path")


const authRoutes = require('./routes/auth')
const contactsRoutes = require('./routes/contacts')

const keys = require('./config/keys')
const app = express()

mongoose.connect(keys.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true})
.then(() => {console.log('MongoDb connected')})
.catch(error => console.log(error))

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(passport.initialize())
require('./middleware/passport')(passport)


app.use(require('morgan')('dev'))
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(require('cors')())

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactsRoutes)

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client'))

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'index.html'
            )
        )
    })
}

module.exports = app;