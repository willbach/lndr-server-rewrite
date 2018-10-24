const ethUtil = require('ethereumjs-util')

module.exports = {
  sign: (hashElements, hexKey) => {
    const buffers = hashElements.map((element) => {
      if (element instanceof Buffer) {
        return element
      }
      const regex = /^[0-9a-fA-F]+$/
      if (regex.test(element)) {
        return Buffer.from(element, 'hex')
      }
      return Buffer.from(element)
    })

    const { r, s, v } = ethUtil.ecsign(
      Buffer.concat(buffers),
      Buffer.from(hexKey, 'hex')
    )

    return Buffer.concat([ r, s, Buffer.from([ v ]) ]).toString('hex')
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
