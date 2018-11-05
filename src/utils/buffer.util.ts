export const hexToBuffer = (value) => {
  let newValue = value
  if (value.substr(0, 2) === '0x') {
    newValue = value.substr(2)
  }
  return Buffer.from(newValue, 'hex')
}

export const stringToBuffer = (value) => Buffer.from(value)

export const bufferToHex = (buffer) => buffer.toString('hex')

export const utf8ToBuffer = (value) => Buffer.from(value, 'utf8')

export const int32ToBuffer = (value) => {
  const hexValue = value.toString(16)
  const z = '00000000',
    x = `${z}${z}`
  const stringValue = `${x}${x}${x}${x}`.replace(new RegExp(`.{${hexValue.length}}$`), hexValue)
  return Buffer.from(stringValue, 'hex')
}

export const stripHexPrefix = (value) => {
  if (value.substr(0, 2) === '0x') {
    return value.slice(2)
  }
  return value
}
