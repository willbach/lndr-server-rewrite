import notificationsService from '../services/notifications.service'
import PushRequest from '../dto/push-request'

export default {
  registerChannelID: (req, res) => {
    const pushData = new PushRequest(req.body)
    if (pushData.signatureMatches()) {
      notificationsService.registerChannelID(pushData)
        .then(() => {
          res.status(204).end()
        })
        .catch(err => {
          console.log('[POST] /register_push', err)
          res.status(400).json(err)
        })
    } else {
      res.status(401).json('Signature does not match')
    }
  },
  
  unregisterChannelID: (req, res) => {
    const pushData = new PushRequest(req.body)
    if (pushData.signatureMatches()) {
      notificationsService.unregisterChannelID(pushData)
        .then(() => {
          res.status(204).end()
        })
        .catch(err => {
          console.log('[POST] /unregister_push', err)
          res.status(400).json(err)
        })
    } else {
      res.status(401).json('Signature does not match')
    }
  },
  
}
