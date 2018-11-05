import { badRequest, notFound, successNoContent, unauthorized } from '../utils/http.codes'

import CreditRecord from '../dto/credit-record'
import RejectRequest from '../dto/reject-request'
import transactionService from '../services/transaction.service'

export default {
  createTransaction: (req, res) => {
    const transaction = new CreditRecord(req.body)

    if (transaction.signatureMatches()) {
      transactionService.submitCredit(transaction, 0)
        .then(() => {
          res.status(successNoContent).end()
        })
        .catch((err) => {
          console.error('[POST] /lend or /borrow', err)
          res.status(badRequest).json(err)
        })
    } else {
      console.error('[POST] /lend or /borrow', 'Signature does not match')
      res.status(unauthorized).json('Signature does not match')
    }
  },

  getPendingTransactions: (req, res) => {
    transactionService.getPendingTransactions(req.params.address)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /pending', err)
        res.status(notFound).json(err)
      })
  },

  getTransactions: (req, res) => {
    transactionService.getTransactions(req.query.user)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /transactions', err)
        res.status(notFound).json(err)
      })
  },

  reject: (req, res) => {
    const request = new RejectRequest(req.body)

    transactionService.reject(request)
      .then(() => {
        res.status(successNoContent).end()
      })
      .catch((err) => {
        console.error('[POST] /reject', err)
        if (err.toString().contains('bad rejection sig')) {
          res.status(unauthorized).json(err)
        } else {
          res.status(badRequest).json(err)
        }
      })
  },

  submitMultiSettlement: async (req, res) => {
    const transactions = req.body.map((tx) => new CreditRecord(tx))

    const signaturesMatch = transactions.reduce((acc, cur) => acc && cur.signatureMatches(), true)

    /* eslint-disable no-await-in-loop */
    if (signaturesMatch) {
      let index = 0
      while (transactions.length > 0) {
        const tx = transactions.shift()
        await transactionService.submitCredit(tx, index)
          .catch((err) => {
            console.error('[POST] /multi_settlement', err)
            res.status(badRequest).json(err)
          })

        index += 1
      }

      res.status(successNoContent).end()
    } else {
      res.status(unauthorized).json('Signature does not match')
    }
    /* eslint-enable no-await-in-loop */
  }
}
