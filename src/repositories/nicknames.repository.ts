import db from '../db'

export default {
  insertEmail: (address: string, email: string) => db.any('INSERT INTO nicknames (address, email) VALUES ($1,$2) ON CONFLICT (address) DO UPDATE SET email = EXCLUDED.email', [address, email]),

  insertNick: (address: string, nick: string) => db.any('INSERT INTO nicknames (address, nickname) VALUES ($1,$2) ON CONFLICT (address) DO UPDATE SET nickname = EXCLUDED.nickname', [address, nick]),

  lookupAddressByEmail: (email: string) => db.any('SELECT address, nickname FROM nicknames WHERE email = $1', [email]).then((result) => {
    if (result.length === 0) {
      return null
    }
    return result[0]
  }),

  lookupAddressByNick: (nick: string) => db.any('SELECT address, nickname FROM nicknames WHERE nickname = $1', [nick]).then((result) => {
    if (result.length === 0) {
      return null
    }
    return result[0]
  }),

  lookupAddressesByFuzzyNick: (nick: string) => {
    const fuzzyNick = `${nick}%`
    return db.any('SELECT address, nickname FROM nicknames WHERE nickname LIKE $1 LIMIT 10', [fuzzyNick]).then((results) => results.map((result) => ({ addr: result.address, nick: result.nickname })))
  },

  lookupEmail: (address: string) => db.any('SELECT email FROM nicknames WHERE address = $1', [address]).then((result) => {
    if (result.length === 0) {
      return null
    }
    return result[0].email
  }),

  lookupNick: (address: string) => db.any('SELECT nickname FROM nicknames WHERE address = $1', [address]).then((result) => {
    if (result.length === 0) {
      return null
    }
    return result[0].nickname
  })
}
