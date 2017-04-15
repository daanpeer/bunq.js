const Bunq = require('../lib/bunq')
const ursa = require('ursa')
const crypto = require('crypto')
const config = require('./config.js');
const redis = require('redis');
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// const client = redis.createClient({ host: 'redis' });

async function generateKeyPair() {
  const keyPair = ursa.generatePrivateKey(2048)
  return {
    public: keyPair.toPublicPem('utf8'),
    private: keyPair.toPrivatePem('utf8')
  }
}

async function main () {
  try {
    const options = {
      apiKey: config.apiKey,
      keyPair: await generateKeyPair(),
      debug: true
    }

    const bunq = new Bunq(options)
    await bunq.installation()
    await bunq.device({
      ipAddresses: config.ipAddreses,
      description: 'Permitted ips'
    })
    let sessionData = await bunq.session();

    bunq.setSessionToken(sessionData.token);
    const monetaryAccounts = await bunq.monetaryAccounts().list(sessionData.user.id);

    const paymentCalls = [];
    monetaryAccounts.forEach(async (account) => {
      paymentCalls.push(account.payments());
    });

    const payments = await Promise.all(paymentCalls);
    console.log(payments);
  } catch (err) {
    console.log(err);
  }
}

main()

