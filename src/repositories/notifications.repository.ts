import db from 'src/db'
import request from 'request-promise'
import configService from 'services/config.service'
import nicknamesRepository from 'repositories/nicknames.repository'

export default {
    insertPushDatum: function(channelID: string, address: string, platform: string) {
        return db.any("INSERT INTO push_data (channel_id, address, platform) VALUES ($1,$2,$3) ON CONFLICT (channel_id) DO UPDATE SET (address, platform) = (EXCLUDED.address, EXCLUDED.platform)", [channelID, address, platform])
    },

    lookupPushDatumByAddress: function(address: string) {
        return db.any("SELECT channel_id, platform FROM push_data WHERE address = $1", [address])
    },

    deletePushDatum: function(channelID: string, address: string, platform: string) {
        return db.any("DELETE FROM push_data WHERE address = $1 AND channel_id = $2 AND platform = $3", [address, channelID, platform])
    },

    sendNotification: async function(nickAddress: string, recipientAddress: string, notificationType: string) {
        const nickname = await nicknamesRepository.lookupNick(nickAddress)[0]
        const pushData = await this.lookupPushDatumByAddress(recipientAddress)

        return Promise.all(pushData.map(datum => {
            const notification = {
                channelID: datum.channel_id,
                platform: datum.platform,
                user: nickname,
                notificationType
            }

            const options = {
                method: 'POST',
                uri: configService.notificationsApiUrl,
                body: notification,
                headers: {
                    "x-api-key": configService.notificationsApiKey
                },
                json: true // Automatically stringifies the body to JSON
            }
            
            return request(options)
        }))
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
