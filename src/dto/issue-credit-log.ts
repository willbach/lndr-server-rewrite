export default class IssueCreditLog {
  ucac: string
  creditor: string
  debtor: string
  amount: number
  nonce: number
  memo: string

  constructor(data: any) {
    this.ucac = data.ucac
    this.creditor = data.creditor
    this.debtor = data.debtor
    this.nonce = data.nonce
    this.memo = data.memo
    this.amount = data.amount
  }
}

export const hashCreditLog = (log: IssueCreditLog) => {
  const { ucac, creditor, debtor, amount, memo, nonce } = log

  const buffer = Buffer.concat([
    Buffer.from(ucac, 'hex'),
    Buffer.from(creditor, 'hex'),
    Buffer.from(debtor, 'hex'),
    Buffer.from(amount.toString()),
    Buffer.from(memo),
    Buffer.from(nonce.toString())
  ])

  return buffer.toString('hex')
}
