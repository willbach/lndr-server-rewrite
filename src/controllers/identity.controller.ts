const crypto = require('crypto')

import serverConfig from '../services/config.service'
import identityService from '../services/identity.service'
import IdentityVerificationRequest from '../dto/identity-verification-request'
import IdentityVerificationResponse from '../dto/identity-verification-response'
import VerificationStatusRequest from '../dto/verification-status-request'

export default {
  registerUser: (req, res) => {
    const verificationRequest = new IdentityVerificationRequest(req.body)

    if (verificationRequest.signatureMatches()) {
      identityService.registerUser(verificationRequest)
        .then(data => {
          res.json(data)
        })
        .catch(err => {
          res.status(400).json(err)
        })
    } else {
      res.status(401).json('Signature does not match')
    }
  },

  handleCallback: (req, res) => {
    const { digest } = req.query

    const computedDigest = crypto.createHmac('sha1', serverConfig.sumsubApiCallbackSecret).update(req.body, 'utf8').digest('hex')

    const digestMatches = digest === computedDigest
    console.log('computed digest', digest, digestMatches)

    if (digestMatches) {
      identityService.handleCallback(req.body)
        .then(() => {
          res.status(204).end()
        })
        .catch(err => {
          res.status(400).json(err)
        })
    } else {
      res.status(401).json('Digest does not match')
    }
  },

  checkStatus: (req, res) => {
    const statusRequest = new VerificationStatusRequest(req.body)

    if (statusRequest.signatureMatches()) {
      identityService.checkStatus(statusRequest)
        .then(data => {
          res.json(data)
        })
        .catch(err => {
          res.status(400).json(err)
        })
    } else {
      res.status(401).json('Signature does not match')
    }
  },

}
