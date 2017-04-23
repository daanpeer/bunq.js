/* @flow */
export interface BunqInterface {
  sessionToken: string,
  user: {
    id: Number,
  },
  performRequest (
    method: string,
    endpoint: string,
    body?: { [string]: any },
    header?: { [string]: string },
    sign: boolean
  ): Promise<Object>
}
