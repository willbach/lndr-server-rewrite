const crypto = require('crypto')

import { badRequest, notFound, successNoContent, unauthorized } from '../utils/http.codes'

import IdentityVerificationRequest from '../dto/identity-verification-request'
import VerificationStatusRequest from '../dto/verification-status-request'
import identityService from '../services/identity.service'
import serverConfig from '../services/config.service'

export default {
  checkStatus: (req, res) => {
    const statusRequest = new VerificationStatusRequest(req.body)

    if (statusRequest.signatureMatches()) {
      identityService.checkStatus(statusRequest)
        .then((data) => {
          res.json(data)
        })
        .catch((err) => {
          console.error('[POST] /check_verification_status')
          res.status(notFound).json(err)
        })
    } else {
      res.status(unauthorized).json('Signature does not match')
    }
  },

  handleCallback: (req, res) => {
    const { digest } = req.query

    const computedDigest = crypto.createHmac('sha1', serverConfig.sumsubApiCallbackSecret).update(req.body, 'utf8').digest('hex')

    const digestMatches = digest === computedDigest

    if (digestMatches) {
      identityService.handleCallback(req.body)
        .then(() => {
          res.status(successNoContent).end()
        })
        .catch((err) => {
          console.error('[POST] /verify_identity_callback')
          res.status(badRequest).json(err)
        })
    } else {
      console.error('computed digest does not match', digest, digestMatches)
      res.status(unauthorized).json('Digest does not match')
    }
  },

  registerUser: (req, res) => {
    const verificationRequest = new IdentityVerificationRequest(req.body)

    if (verificationRequest.signatureMatches()) {
      identityService.registerUser(verificationRequest)
        .then((data) => {
          res.json(data)
        })
        .catch((err) => {
          console.error('[POST] /verify_identity')
          res.status(badRequest).json(err)
        })
    } else {
      res.status(unauthorized).json('Signature does not match')
    }
  }
}
