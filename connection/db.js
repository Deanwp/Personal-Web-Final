const {Pool} = require('pg')
const dbPool = new Pool({
    database: 'personal-web-b30',
    port: 5432,
    user: 'postgres',
    password: 'user'
})

module.exports = dbPool