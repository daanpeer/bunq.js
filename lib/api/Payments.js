const Api = require('./Api')

class Payments extends Api {
  async list (monetaryId) {
    const data = await this.get(`user/${this.client.user.id}/monetary-account/${monetaryId}/payment`)
    return data.Response;
  }
}

module.exports = Payments;
