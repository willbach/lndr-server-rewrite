const fs = require('fs')
const path = require('path')

const config = fs.readFileSync(path.join(__dirname, '../../data/lndr-server.config.json'), { encoding: 'utf8' })

const dbConfig = JSON.parse(config).db

const pgp = require('pg-promise')(/*options*/)

const cn = {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.name,
  user: dbConfig.user,
  password: dbConfig['user-password']
}

const db = pgp(cn)

export default db
