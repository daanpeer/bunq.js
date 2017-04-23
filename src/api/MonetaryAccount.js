/* @flow */
import { BunqInterface } from '../BunqInterface'
import Payments from './Payments'
import Api from './Api'
import type { MonetaryAccountResponse } from './responseTypes'

export default class MonetaryAccount extends Api {
  data: MonetaryAccountResponse

  constructor (client: BunqInterface, data: MonetaryAccountResponse) {
    super(client)
    this.data = data
  }

  payments () {
    return new Payments(this.client)
      .list(this.data.MonetaryAccountBank.id)
  }
}
