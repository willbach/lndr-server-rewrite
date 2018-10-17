import db from '../db'

export default {
    addFriends: (address: string, friend: string) => {
        return db.any("INSERT INTO friendships (origin, friend) VALUES ($1,$2) ON CONFLICT ON CONSTRAINT friendships_origin_friend_key DO NOTHING", [address, friend])
    },
    
    removeFriends: (address: string, addresses: [string]) => {
        return db.any("DELETE FROM friendships WHERE origin = $1 AND friend in $2 OR friend = $1 AND origin in $2", [address, addresses])
    },
    
    lookupFriends: (address: string) => {
        return db.any("SELECT inbound.origin, nicknames.nickname FROM friendships inbound INNER JOIN friendships outbound ON inbound.friend = outbound.origin AND inbound.origin = outbound.friend LEFT JOIN nicknames ON nicknames.address = inbound.origin WHERE inbound.friend = $1", [address])
    },
    
    lookupInboundFriendRequests: (address: string) => {
        return db.any("SELECT inbound.origin, nicknames.nickname FROM friendships inbound LEFT JOIN friendships outbound ON inbound.friend = outbound.origin AND inbound.origin = outbound.friend LEFT JOIN nicknames ON nicknames.address = inbound.origin WHERE inbound.friend = $1 AND outbound.friend IS NULL", [address])
    },
    
    lookupOutboundFriendRequests: (address: string) => {
        return db.any("SELECT outbound.friend, nicknames.nickname FROM friendships outbound LEFT JOIN friendships inbound ON outbound.friend = inbound.origin AND outbound.origin = inbound.friend LEFT JOIN nicknames ON nicknames.address = outbound.friend WHERE outbound.origin = $1 AND inbound.friend IS NULL", [address])
    },
    
    sentFriendRequestTo: (address: string, friendAddresses: [string]) => {
        return db.any("SELECT inbound.friend FROM friendships inbound LEFT JOIN friendships outbound ON inbound.friend = outbound.origin AND inbound.origin = outbound.friend WHERE inbound.origin = $1 AND inbound.friend in $2 AND outbound.friend IS NULL", [address, friendAddresses])
    }
}
