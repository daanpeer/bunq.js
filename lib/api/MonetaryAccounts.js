const Payments = require('./Payments')
const Api = require('./Api')

class MonetaryAccount {
  constructor (client, params) {
    this.client = client
    this.params = params
  }

  payments () {
    return new Payments(this.client).list(this.params.id)
  }
}

class MonetaryAccounts extends Api {

  async list () {
    const data = await this.get(`user/${this.client.user.id}/monetary-account`)

    const monetaryAccounts = [];
    data.Response.forEach((monetary) => {
      monetaryAccounts.push(new MonetaryAccount(this.client, monetary.MonetaryAccountBank))
    })
    return monetaryAccounts;
  }
}

module.exports = MonetaryAccounts


