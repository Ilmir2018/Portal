const express = require('express')
const passport = require("passport")
const path = require("path")


const authRoutes = require('./routes/auth')
const contactsRoutes = require('./routes/contacts')
const menuRoutes = require('./routes/menu')
const dataRoutes = require('./routes/data')
const triggerRoutes = require('./routes/triggers')

const triggers = require('./triggers')

const app = express()

app.use(passport.initialize())
require('./middleware/passport')(passport)


app.use(require('morgan')('dev'))
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(require('cors')())

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactsRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/dannye', dataRoutes)
app.use('/api/triggers', triggerRoutes)

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