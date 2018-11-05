import * as request from 'request-promise'
import configService from '../services/config.service'
import db from '../db'
import nicknamesRepository from '../repositories/nicknames.repository'

export default {
  deletePushDatum(channelID: string, address: string, platform: string) {
    return db.any('DELETE FROM push_data WHERE address = $1 AND channel_id = $2 AND platform = $3', [address, channelID, platform])
  },

  insertPushDatum(channelID: string, address: string, platform: string) {
    return db.any('INSERT INTO push_data (channel_id, address, platform) VALUES ($1,$2,$3) ON CONFLICT (channel_id) DO UPDATE SET (address, platform) = (EXCLUDED.address, EXCLUDED.platform)', [channelID, address, platform])
  },

  lookupPushDatumByAddress(address: string) {
    return db.any('SELECT channel_id, platform FROM push_data WHERE address = $1', [address])
  },

  async sendNotification(nickAddress: string, recipientAddress: string, notificationType: string) {
    const nickname = await nicknamesRepository.lookupNick(nickAddress)[0]
    const pushData = await this.lookupPushDatumByAddress(recipientAddress)

    return Promise.all(pushData.map((datum) => {
      const notification = {
        channelID: datum.channel_id,
        notificationType,
        platform: datum.platform,
        user: nickname
      }

      const options = {
        body: notification,
        headers: {
          'x-api-key': configService.notificationsApiKey
        },
        json: true,
        method: 'POST',
        uri: configService.notificationsApiUrl
      }

      return request(options)
    }))
    // ServerConfig -> Notification -> IO Int
    // SendNotification config notification = do
    // InitReq <- HTTP.parseRequest notificationUrl
    // Let req = HTTP.addRequestHeader HTTP.hAccept acceptContent $
    //                 HTTP.addRequestHeader "x-api-key" (notificationsApiKey config) $
    //                 HTTP.setRequestBodyJSON notification $ HTTP.setRequestMethod "POST" initReq
    // HTTP.getResponseStatusCode <$> HTTP.httpNoBody req
    // Where acceptContent = "application/json"
    //     NotificationUrl = (notificationsApiUrl config)
  }
}
