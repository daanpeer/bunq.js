/* @flow */
import { BunqInterface } from '../BunqInterface'

export default class Api {
  client: BunqInterface

  constructor (client: BunqInterface) {
    this.client = client
  }

  async get<Object> (endpoint: string, body?: { [any]: any }): Promise<Object> {
    const data: Object = await this.client.performRequest(
      'GET',
      endpoint,
      body,
      {
        'X-Bunq-Client-Authentication': this.client.sessionToken,
        'Content-Type': 'application/json'
      },
      true
    )

    if (!data.Response) {
      throw Error('Coudln\'t read response')
    }

    return data
  }
}
