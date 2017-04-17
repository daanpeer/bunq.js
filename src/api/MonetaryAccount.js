/* @flow */
import { BunqInterface } from '../BunqInterface'
import Payments from './Payments'
import Api from './Api'

export default class MonetaryAccount extends Api {
  params: {[any]: any}

  constructor (client: BunqInterface, params: { [any]: [any] }) {
    super(client)
    this.params = params
  }

  payments () {
    return new Payments(this.client)
      .list(this.params.id)
  }
}
