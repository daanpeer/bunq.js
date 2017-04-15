const Api = require('./Api')
const MonetaryAccount = require('./MonetaryAccount');

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


