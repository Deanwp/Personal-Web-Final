const {Pool} = require('pg')
const dbPool = new Pool({
    host: 'ec2-107-21-146-133.compute-1.amazonaws.com'
    database: 'ddv7gd9vkf0j6j',
    port: 5432,
    user: 'sfolraipwbrfcl',
    password: '82c94a5cfdc1c99fa5c29005e80d76552e0078f4043fc42fb8dbc0a3575e1d17'
})

module.exports = dbPool