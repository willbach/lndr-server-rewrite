import pendingRepository from 'repositories/pending.repository'
import notificationsRepository from 'repositories/notifications.repository'
import nicknamesRepository from 'repositories/nicknames.repository'

import PayPalRequest from "dto/paypal-request"

export default {
  requestPayPal: async(paypalRequest: PayPalRequest) => {
    //TODO: send a notification here
    const { friend, requestor } = paypalRequest
    await pendingRepository.insertPayPalRequest(friend, requestor)
    const nickname = await nicknamesRepository.lookupNick(requestor)[0]
    const pushData = await notificationsRepository.lookupPushDatumByAddress(friend)

    return Promise.all(pushData.map(datum => {
      const notification = {
        channelID: datum.channel_id,
        platform: datum.platform,
        user: nickname,
        notificationType: 'RequestPayPal'
      }

      return notificationsRepository.sendNotification(notification)
    }))

    // pushDataM <- liftIO . withResource pool $ Db.lookupPushDatumByAddress friend
    //         nicknameM <- liftIO . withResource pool $ Db.lookupNick requestor

    //         forM_ pushDataM $ \(channelID, platform) -> liftIO $ do
    //             responseCode <- sendNotification config (Notification channelID platform nicknameM RequestPayPal )
    //             let logMsg = "Notification response (PayPal Request): " ++ show responseCode
    //             pushLogStrLn loggerSet . toLogStr $ logMsg
  },

  getPayPalRequests: (address: string) => {
    return pendingRepository.lookupPayPalRequestsByAddress(address)
  },

  deletePayPalRequest: (deleteRequest: PayPalRequest) => {
    return pendingRepository.deletePayPalRequest(deleteRequest.friend, deleteRequest.requestor)
  }
}
