const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
// const mongoose = require('mongoose')
// const User = mongoose.model('users')
const keys = require('../config/keys')

const db = require('../posgres')
// require('dotenv').config();


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.jwt;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (payload, done) => {

            try {
                const user = db.query(
                    `SELECT * FROM users WHERE id = $1`, [payload.userId]
                )

                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            } catch(e) {
                console.log(e)
            }
        })
    )
}