/* @flow */
export type SessionResponse = {
  Response: [
    { Id: { id: number } },
    { Token: { [string]: string } },
    { [string]: Object }
  ]
}
