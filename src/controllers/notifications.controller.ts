import { badRequest, successNoContent, unauthorized } from '../utils/http.codes'

import PushRequest from '../dto/push-request'
import notificationsService from '../services/notifications.service'

export default {
  registerChannelID: (req, res) => {
    const pushData = new PushRequest(req.body)
    if (pushData.signatureMatches()) {
      notificationsService.registerChannelID(pushData)
        .then(() => {
          res.status(successNoContent).end()
        })
        .catch((err) => {
          console.error('[POST] /register_push', err)
          res.status(badRequest).json(err)
        })
    } else {
      res.status(unauthorized).json('Signature does not match')
    }
  },

  unregisterChannelID: (req, res) => {
    const pushData = new PushRequest(req.body)
    if (pushData.signatureMatches()) {
      notificationsService.unregisterChannelID(pushData)
        .then(() => {
          res.status(successNoContent).end()
        })
        .catch((err) => {
          console.error('[POST] /unregister_push', err)
          res.status(badRequest).json(err)
        })
    } else {
      res.status(unauthorized).json('Signature does not match')
    }
  }

}
