class Api {
  constructor (client) {
    this.client = client
  }

  async get (endpoint) {
    const data = await this.client.performRequest({
      method: 'GET',
      endpoint,
      sign: true,
      headers: {
        'X-Bunq-Client-Authentication': this.client.sessionToken,
        'Content-Type': 'application/json'
      }
    })

    if (!data.Response) {
      throw Error('Coudln\'t read response')
    }

    return data
  }
}

module.exports = Api
