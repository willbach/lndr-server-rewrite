import balanceService from '../services/balance.service'

export default {
  getCounterParties: (req: any, res: any) => {
    balanceService.getCounterParties(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  getTwoPartyBalance: (req: any, res: any) => {
    const { address1, address2 } = req.params
    balanceService.getTwoPartyBalance(address1, address2, req.query.currency)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  getBalance: (req: any, res: any) => {
    balanceService.getBalance(req.params.address, req.query.currency)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  }
}
