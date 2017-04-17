/* @flow */
import BunqInterface from '../BunqInterface'
import Payments from './Payments'

export default class MonetaryAccount {
  client: BunqInterface
  params: {[any]: any}

  constructor (client: BunqInterface, params: { [any]: [any] }) {
    this.client = client
    this.params = params
  }

  payments () {
    return new Payments(this.client).list(this.params.id)
  }
}
