import db from 'src/db'

export default {
    insertNick: (address: string, nick: string) => {
        return db.any("INSERT INTO nicknames (address, nickname) VALUES ($1,$2) ON CONFLICT (address) DO UPDATE SET nickname = EXCLUDED.nickname", address, nick)
    },
    
    insertEmail: (address: string, email: string) => {
        return db.any("INSERT INTO nicknames (address, email) VALUES ($1,$2) ON CONFLICT (address) DO UPDATE SET email = EXCLUDED.email", address, email)
    },
    
    
    lookupNick: (address: string) => {
        return db.any("SELECT nickname FROM nicknames WHERE address = $1", address)
    },
    
    
    lookupEmail: (address: string) => {
        return db.any("SELECT email FROM nicknames WHERE address = $1", address)
    }, 
    
    
    lookupAddressByNick: (nick: string) => {
        return db.any("SELECT address, nickname FROM nicknames WHERE nickname = $1", nick)
    },
    
    lookupAddressByEmail: (email: string) => {
        return db.any("SELECT address, nickname FROM nicknames WHERE email = $1", email)
    },
    
    
    lookupAddressesByFuzzyNick: (nick: string) => {
        return db.any("SELECT address, nickname FROM nicknames WHERE nickname LIKE $1 LIMIT 10", nick + "%")
    }
}
