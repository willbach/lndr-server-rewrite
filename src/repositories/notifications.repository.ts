import db from 'src/db'

export default {
    insertPushDatum: (channelID: string, address: string, platform: string) => {
        return db.any("INSERT INTO push_data (channel_id, address, platform) VALUES ($1,$2,$3) ON CONFLICT (channel_id) DO UPDATE SET (address, platform) = (EXCLUDED.address, EXCLUDED.platform)", channelID, address, platform)
    },

    lookupPushDatumByAddress: (address: string) => {
        return db.any("SELECT channel_id, platform FROM push_data WHERE address = $1", address)
    },

    deletePushDatum: (channelID: string, address: string, platform: string) => {
        return db.any("DELETE FROM push_data WHERE address = $1 AND channel_id = $2 AND platform = $3", address, channelID, platform)
    },

    sendNotification: () => {
        // ServerConfig -> Notification -> IO Int
        // sendNotification config notification = do
        // initReq <- HTTP.parseRequest notificationUrl
        // let req = HTTP.addRequestHeader HTTP.hAccept acceptContent $
        //                 HTTP.addRequestHeader "x-api-key" (notificationsApiKey config) $
        //                 HTTP.setRequestBodyJSON notification $ HTTP.setRequestMethod "POST" initReq
        // HTTP.getResponseStatusCode <$> HTTP.httpNoBody req
        // where acceptContent = "application/json"
        //     notificationUrl = (notificationsApiUrl config)
    }
}




