const Bunq = require('./lib/bunq')
const redis = require('redis')
const ursa = require('ursa')
const crypto = require('crypto')
const config = require('config.js');

const keyPair = ursa.generatePrivateKey(2048)
const keys = {
  public: keyPair.toPublicPem('utf8'),
  private: keyPair.toPrivatePem('utf8')
}

const options = {
  apiKey: config.apiKey,
  keyPair: keys,
  debug: true
}

async function main () {
  try {
    const bunq = new Bunq(options)
    await bunq.installation()
    await bunq.device({
      ipAddresses: [
        '87.208.240.78',
        '188.206.70.117'
      ],
      description: 'Permitted ips'
    })
    const sessionData = await bunq.session();

    bunq.setSessionToken(sessionData.token);
    const monetaryAccounts = await bunq.listMonetaryAccounts(sessionData.user.id);
    console.log(monetaryAccounts);
  } catch (err) {
    console.log(err);
  }
}

main()

