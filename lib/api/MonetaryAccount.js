const Payments = require('./Payments');

class MonetaryAccount {
  constructor(client, params) {
    this.client = client;
    this.params = params;
  }

  payments() {
    return new Payments(this.client).list(this.params.id);
  }
}

module.exports = MonetaryAccount;