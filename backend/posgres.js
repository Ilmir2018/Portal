const Pool = require("pg").Pool

const pool = new Pool({
    user: 'postgres',
    password: 'leonardodv2901',
    host: 'localhost',
    port: 5432,
    database: 'portal'
})

module.exports = pool