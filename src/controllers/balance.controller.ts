import balanceService from 'services/balance.service'

export default {
  getCounterParties: (req: any, res: any) => {
    const { address } = req.params
    balanceService.getCounterParties(address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  getTwoPartyBalance: (req: any, res: any) => {
    const { address1, address2 } = req.params
    const { currency } = req.query
    balanceService.getTwoPartyBalance(address1, address2, currency)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  getBalance: (req: any, res: any) => {
    const { address } = req.params
    const { currency } = req.query
    balanceService.getBalance(address, currency)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  }
}
