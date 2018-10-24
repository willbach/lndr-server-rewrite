import paypalService from '../services/paypal.service'
import PayPalRequest from '../dto/paypal-request'

export default {
  requestPayPal: (req, res) => {
    const paypalRequest = new PayPalRequest(req.body)

    if (paypalRequest.signatureMatches()) {
      paypalService.requestPayPal(paypalRequest)
        .then(() => {
          res.status(204).end()
        })
        .catch(err => {
          res.status(400).json(err)
        })
    } else {
      res.status(401).json('Signature does not match')
    }
  },

  getPayPalRequests: (req, res) => {
    paypalService.getPayPalRequests(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        console.log('[POST] /request_paypal', err)
        res.status(400).json(err)
      })
  },

  deletePayPalRequest: (req, res) => {
    const deleteRequest = new PayPalRequest(req.body)

    if (deleteRequest.signatureMatches()) {
      paypalService.deletePayPalRequest(deleteRequest)
        .then(() => {
          res.status(204).end()
        })
        .catch(err => {
          res.status(400).json(err)
        })
    } else {
      res.status(401).json('Signature does not match')
    }
  }
}
