/* @flow */
import Api from './Api'
import MonetaryAccount from './MonetaryAccount'
import type { MonetaryAccountsResponse } from './responseTypes'

export default class MonetaryAccounts extends Api {
  async list (): Array<MonetaryAccount> | Promise<any> {
    const data: MonetaryAccountsResponse = await this.get(`user/${this.client.user.id.toString()}/monetary-account`)

    const monetaryAccounts: Array<MonetaryAccount> = []
    data.Response.forEach((monetary) => {
      monetaryAccounts.push(new MonetaryAccount(this.client, monetary))
    })
    return monetaryAccounts
  }
}
