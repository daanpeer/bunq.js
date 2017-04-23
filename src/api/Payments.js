/* @flow */
import Api from './Api'
import type { PaymentsResponse } from './responseTypes'

export default class Payments extends Api {
  async list (monetaryId: number): Promise<PaymentsResponse> {
    return this.get(`user/${this.client.user.id.toString()}/monetary-account/${monetaryId}/payment`)
  }
}
