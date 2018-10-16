import fs from 'fs'

const config = fs.readFileSync('../data/lndr-server.config.json', { encoding: 'utf8' })

const dbConfig = JSON.parse(config).db

const pgp = require('pg-promise')(/*options*/)
const db = pgp(`postgres://${dbConfig.user}:${dbConfig['user-password']}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`)

export default db
