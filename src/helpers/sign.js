import crypto from 'crypto'

const sign = (privateKey, data) => {
  const sign = crypto.createSign('sha256')
  sign.update(data)
  return sign.sign({key: privateKey}, 'base64')
}

export { sign as default }
