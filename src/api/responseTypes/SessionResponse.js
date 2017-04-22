/* @flow */
export type SessionResponse = {
  Response: [
    { Id: { id: number } },
    { Token: { [string]: string } },
    { UserCompany: { [string]: any } }
  ]
}
