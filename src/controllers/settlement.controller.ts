import settlementService from '../services/settlement.service'
import VerifySettlementRequest from '../dto/verify-settlement-request'

export default {
  getPendingSettlements: (req, res) => {
    settlementService.getPendingSettlements(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  verifySettlement: (req, res) => {
    const verification = new VerifySettlementRequest(req.body)

    if (verification.signatureMatches()) {
      settlementService.verifySettlement(verification)
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

  getTxHash: (req, res) => {
    settlementService.getTxHash(req.params.creditHash)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  }
}
