import pendingRepository from '../repositories/pending.repository'
import notificationsRepository from '../repositories/notifications.repository'

import PayPalRequest from "dto/paypal-request"

export default {
  requestPayPal: async(paypalRequest: PayPalRequest) => {
    //TODO: send a notification here
    const { friend, requestor } = paypalRequest
    const storage = await pendingRepository.insertPayPalRequest(friend, requestor)

    notificationsRepository.sendNotification(requestor, friend, 'RequestPayPal')

    return storage
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
