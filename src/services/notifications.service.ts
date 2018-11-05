import PushRequest from '../dto/push-request'
import notificationsRepository from '../repositories/notifications.repository'

export default {
  registerChannelID: (pushData: PushRequest) => notificationsRepository.insertPushDatum(pushData.channelID, pushData.address, pushData.platform),

  unregisterChannelID: (pushData: PushRequest) => notificationsRepository.deletePushDatum(pushData.channelID, pushData.address, pushData.platform)
}
