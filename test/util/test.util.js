const ethUtil = require('ethereumjs-util')

module.exports = {
  signCredit(creditRecord, privateKey, hashPersonalMessage = true) {
    var { ucac, creditor, debtor, amount, nonce } = creditRecord

    var buffer = Buffer.concat([
        this.hexToBuffer(ucac),
        this.hexToBuffer(creditor),
        this.hexToBuffer(debtor),
        this.int32ToBuffer(amount),
        this.int32ToBuffer(nonce)
    ])
    
    var insideHash = ethUtil.sha3(buffer)

    var privateKeyBuffer = Buffer.from(privateKey, 'hex')

    var { r, s, v } = ethUtil.ecsign(
        ethUtil.hashPersonalMessage(insideHash),
        privateKeyBuffer
    )

    return this.bufferToHex(
        Buffer.concat(
            [ r, s, Buffer.from([ v ]) ]
        )
    )
  },

  serverSign(hash, privateKeyHex) {
    const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex')
    const { r, s, v } = ethUtil.ecsign(
      this.hexToBuffer(hash),
      privateKeyBuffer
    )

    return this.bufferToHex(
      Buffer.concat(
        [ r, s, Buffer.from([ v ]) ]
      )
    )
  },

  bufferToHex(buffer) {
    return buffer.toString('hex')
  },

  stringToBuffer(value) {
    return Buffer.from(value)
  },

  hexToBuffer(value) {
    if (value.substr(0, 2) === '0x') {
        value = value.substr(2)
    }
    return Buffer.from(value, 'hex')
  },

  utf8ToBuffer(value) {
    return Buffer.from(value, 'utf8')
  },

  int32ToBuffer(value) {
    const hexValue = value.toString(16)
    const z = '00000000', x = `${z}${z}`
    const stringValue = `${x}${x}${x}${x}`.replace(new RegExp(`.{${hexValue.length}}$`), hexValue)
    return Buffer.from(stringValue, 'hex')
  },
  
  privateToAddress: (privateKeyHex) => {
    const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex')
    return ethUtil.privateToAddress(privateKeyBuffer).toString('hex')
  }
}
