require('dotenv').config()
const logger = require('../config/logger')

const {Pool} = require('pg')

const client = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
})

client.connect().then(_ => {
    logger.info(`⚡ Connected to Database ⚡`)
}).catch(e => logger.error(e));

module.exports = client
