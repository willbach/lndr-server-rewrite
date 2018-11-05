import balanceService from '../services/balance.service'
import { notFound } from '../utils/http.codes'

export default {
  getBalance: (req: any, res: any) => {
    balanceService.getBalance(req.params.address, req.query.currency)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /balance', err)
        res.status(notFound).json(err)
      })
  },

  getCounterParties: (req: any, res: any) => {
    balanceService.getCounterParties(req.params.address)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /counterparties', err)
        res.status(notFound).json(err)
      })
  },

  getTwoPartyBalance: (req: any, res: any) => {
    const { address1, address2 } = req.params
    balanceService.getTwoPartyBalance(address1, address2, req.query.currency)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /balance', err)
        res.status(notFound).json(err)
      })
  }
}
