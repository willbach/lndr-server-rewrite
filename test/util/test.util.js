const ethUtil = require('ethereumjs-util')

module.exports = {
  sign: (hashElements, hexKey) => {
    const buffers = hashElements.map((element) => {
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
  
  privateToAddress: (privateKeyHex) => {
    const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex')
    return ethUtil.privateToAddress(privateKeyBuffer).toString('hex')
  }
}
