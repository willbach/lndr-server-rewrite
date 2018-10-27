import transactionService from '../services/transaction.service'
import RejectRequest from '../dto/reject-request'
import CreditRecord from '../dto/credit-record'

export default {
  createTransaction: (req, res) => {
    const transaction = new CreditRecord(req.body)

    if (transaction.signatureMatches()) {
      transactionService.submitCredit(transaction, 0)
        .then(() => {
          res.status(204).end()
        })
        .catch(err => {
          console.log('[POST] /lend or /borrow', err)
          res.status(400).json(err)
        })
    } else {
      res.status(401).json('Signature does not match')
    }
  },

  submitMultiSettlement: async(req, res) => {
    const transactions = req.body.map(tx => new CreditRecord(tx))

    const signaturesMatch = transactions.reduce((acc, cur) => acc && cur.signatureMatches(), true)
    
    if (signaturesMatch) {
      // new logic here

      let index = 0
      while (transactions.length > 0) {
        let tx = transactions.shift()
        await transactionService.submitCredit(tx, index)
          .catch(err => {
            console.log('[POST] /multi_settlement', err)
            res.status(400).json(err)
          })
        
        index++
      }

      res.status(204).end()

    } else {
      res.status(401).json('Signature does not match')
    }
  },

  reject: (req, res) => {
    const request = new RejectRequest(req.body)

    transactionService.reject(request)
      .then(() => {
        res.status(204).end()
      })
      .catch(err => {
        console.log('[POST] /reject', err)
        if (err.contains('bad rejection sig')) {
          res.status(401).json(err)
        } else {
          res.status(400).json(err)
        }
      })
  },

  getTransactions: (req, res) => {
    transactionService.getTransactions(req.query.user)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        console.log('[GET] /transactions', err)
        res.status(400).json(err)
      })
  },

  getPendingTransactions: (req, res) => {
    transactionService.getPendingTransactions(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        console.log('[GET] /pending', err)
        res.status(400).json(err)
      })
  }
}
