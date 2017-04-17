/* @flow */
import crypto from 'crypto'

const sign = (privateKey: string, data: string): string => {
  const sign = crypto.createSign('sha256')
  sign.update(data)
  return sign.sign(privateKey, 'base64')
}

export { sign as default }
