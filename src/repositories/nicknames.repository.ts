import db from '../db'

export default {
    insertNick: (address: string, nick: string) => {
        return db.any("INSERT INTO nicknames (address, nickname) VALUES ($1,$2) ON CONFLICT (address) DO UPDATE SET nickname = EXCLUDED.nickname", [address, nick])
    },
    
    insertEmail: (address: string, email: string) => {
        return db.any("INSERT INTO nicknames (address, email) VALUES ($1,$2) ON CONFLICT (address) DO UPDATE SET email = EXCLUDED.email", [address, email])
    },
    
    lookupNick: (address: string) => {
        return db.any("SELECT nickname FROM nicknames WHERE address = $1", [address]).then(result => {
            if (result.length === 0) {
                return null
            } else {
                return result[0].nickname
            }
        })
    },
    
    lookupEmail: (address: string) => {
        return db.any("SELECT email FROM nicknames WHERE address = $1", [address]).then(result => {
            if (result.length === 0) {
                return null
            } else {
                return result[0].email
            }
        })
    }, 
    
    lookupAddressByNick: (nick: string) => {
        return db.any("SELECT address, nickname FROM nicknames WHERE nickname = $1", [nick]).then(result => {
            if (result.length === 0) {
                return null
            } else {
                return result[0]
            }
        })
    },
    
    lookupAddressByEmail: (email: string) => {
        return db.any("SELECT address, nickname FROM nicknames WHERE email = $1", [email]).then(result => {
            if (result.length === 0) {
                return null
            } else {
                return result[0]
            }
        })
    },
    
    lookupAddressesByFuzzyNick: (nick: string) => {
        const fuzzyNick = nick + "%"
        return db.any("SELECT address, nickname FROM nicknames WHERE nickname LIKE $1 LIMIT 10", [fuzzyNick]).then(results => results.map(result => {
            return { addr: result.address, nick: result.nickname }
        }))
    }
}
