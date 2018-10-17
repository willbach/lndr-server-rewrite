import identityService from '../services/identity.service'
import IdentityVerificationRequest from '../dto/identity-verification-request';
import IdentityVerificationResponse from '../dto/identity-verification-response';
import VerificationStatusRequest from '../dto/verification-status-request';

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

    //compute digest
    const digestMatches = true

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
