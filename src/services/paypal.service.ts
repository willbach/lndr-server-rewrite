import PayPalRequest from '../dto/paypal-request'

import notificationsRepository from '../repositories/notifications.repository'
import pendingRepository from '../repositories/pending.repository'

export default {
  deletePayPalRequest: (deleteRequest: PayPalRequest) => pendingRepository.deletePayPalRequest(deleteRequest.friend, deleteRequest.requestor),

  getPayPalRequests: (address: string) => pendingRepository.lookupPayPalRequestsByAddress(address),

  requestPayPal: async (paypalRequest: PayPalRequest) => {
    const { friend, requestor } = paypalRequest
    const storage = await pendingRepository.insertPayPalRequest(friend, requestor)

    notificationsRepository.sendNotification(requestor, friend, 'RequestPayPal')

    return storage
    // PushDataM <- liftIO . withResource pool $ Db.lookupPushDatumByAddress friend
    //         NicknameM <- liftIO . withResource pool $ Db.lookupNick requestor

    //         ForM_ pushDataM $ \(channelID, platform) -> liftIO $ do
    //             ResponseCode <- sendNotification config (Notification channelID platform nicknameM RequestPayPal )
    //             Let logMsg = "Notification response (PayPal Request): " ++ show responseCode
    //             PushLogStrLn loggerSet . toLogStr $ logMsg
  }
}
