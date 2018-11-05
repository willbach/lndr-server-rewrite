import { badRequest, notFound, successNoContent, unauthorized } from '../utils/http.codes'

import VerifySettlementRequest from '../dto/verify-settlement-request'
import settlementService from '../services/settlement.service'

export default {
  getPendingSettlements: (req, res) => {
    settlementService.getPendingSettlements(req.params.address)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /pending_settlements', err)
        res.status(notFound).json(err)
      })
  },

  getTxHash: (req, res) => {
    settlementService.getTxHash(req.params.creditHash)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /tx_hash', err)
        res.status(notFound).json(err)
      })
  },

  verifySettlement: (req, res) => {
    const verification = new VerifySettlementRequest(req.body)

    if (verification.signatureMatches()) {
      settlementService.verifySettlement(verification)
        .then(() => {
          res.status(successNoContent).end()
        })
        .catch((err) => {
          console.error('[POST] /verify_settlement', err)
          res.status(badRequest).json(err)
        })
    } else {
      res.status(unauthorized).json('Signature does not match')
    }
  }
}
