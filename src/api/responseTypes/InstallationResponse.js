/* @flow */
export type InstallationResponse = {
  Response: [
    { Id: { id: number } },
    { Token: { [string]: string } },
    { ServerPublicKey: { server_public_key: string } }
  ]
}
