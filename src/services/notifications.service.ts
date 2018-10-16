import notificationsRepository from 'repositories/notifications.repository'
import PushRequest from "dto/push-request"

export default {
  registerChannelID: (pushData: PushRequest) => {
    return notificationsRepository.insertPushDatum(pushData.channelID, pushData.address, pushData.platform)
  },

  unregisterChannelID: (pushData: PushRequest) => {
    return notificationsRepository.deletePushDatum(pushData.channelID, pushData.address, pushData.platform)
  }
}
