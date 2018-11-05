const fs = require('fs')
const path = require('path')

const config = fs.readFileSync(path.join(__dirname, '../../data/lndr-server.config.json'), { encoding: 'utf8' })

const dbConfig = JSON.parse(config).db

const pgp = require('pg-promise')()

const cn = {
  database: dbConfig.name,
  host: dbConfig.host,
  password: dbConfig['user-password'],
  port: dbConfig.port,
  user: dbConfig.user
}

const db = pgp(cn)

export default db
