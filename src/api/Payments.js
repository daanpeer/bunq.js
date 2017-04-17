/* @flow */
import Api from './Api'

export default class Payments extends Api {
  async list (monetaryId: number): { [any]: any } {
    const data: { [any]: any } = await this.get(`user/${this.client.user.id}/monetary-account/${monetaryId}/payment`)
    return data.Response
  }
}
