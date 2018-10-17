import transactionService from 'services/transaction.service'
import RejectRequest from 'dto/reject-request'
import CreditRecord from 'dto/credit-record';

export default {
  createTransaction: (req, res) => {
    const transaction = new CreditRecord(req.body)

    if (transaction.signatureMatches()) {
      transactionService.submitCredit(transaction, 0)
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

  submitMultiSettlement: (req, res) => {
    const transactions = req.body.map(tx => new CreditRecord(tx))

    const signaturesMatch = transactions.reduce((acc, cur) => acc && cur.signatureMatches() ,true)

    if (signaturesMatch) {
      Promise.all(transactions.map((tx, index) => transactionService.submitCredit(tx, index)))
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

  reject: (req, res) => {
    const request = new RejectRequest(req.body)

    transactionService.reject(request)
      .then(() => {
        res.status(204).end()
      })
      .catch(err => {
        if (err.toString().contains('bad rejection sig')) {
          res.status(401).json(err)
        } else {
          res.status(400).json(err)
        }
      })
  },

  getTransactions: (req, res) => {
      transactionService.getTransactions(req.params.address)
        .then(data => {
          res.json(data)
        })
        .catch(err => {
          res.status(400).json(err)
        })
  },

  getPendingTransactions: (req, res) => {
    transactionService.getPendingTransactions(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  }
}
