import { badRequest, notFound, successNoContent, unauthorized } from '../utils/http.codes'

import PayPalRequest from '../dto/paypal-request'
import paypalService from '../services/paypal.service'

export default {
  deletePayPalRequest: (req, res) => {
    const deleteRequest = new PayPalRequest(req.body)

    if (deleteRequest.signatureMatches()) {
      paypalService.deletePayPalRequest(deleteRequest)
        .then(() => {
          res.status(successNoContent).end()
        })
        .catch((err) => {
          console.error('[POST] /remove_paypal_request', err)
          res.status(badRequest).json(err)
        })
    } else {
      res.status(unauthorized).json('Signature does not match')
    }
  },

  getPayPalRequests: (req, res) => {
    paypalService.getPayPalRequests(req.params.address)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /request_paypal', err)
        res.status(notFound).json(err)
      })
  },

  requestPayPal: (req, res) => {
    const paypalRequest = new PayPalRequest(req.body)

    if (paypalRequest.signatureMatches()) {
      paypalService.requestPayPal(paypalRequest)
        .then(() => {
          res.status(successNoContent).end()
        })
        .catch((err) => {
          console.error('[POST] /request_paypal', err)
          res.status(badRequest).json(err)
        })
    } else {
      res.status(unauthorized).json('Signature does not match')
    }
  }
}
