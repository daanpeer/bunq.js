const Bunq = require('../lib/bunq').default
const ursa = require('ursa')
const config = require('./config.js')

async function generateKeyPair () {
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
    await bunq.device(config.ipAddreses, 'Bunq example')
    let sessionData = await bunq.session()

    bunq.setSessionToken(sessionData.token)
    const monetaryAccounts = await bunq.monetaryAccounts()

    const paymentCalls = []
    monetaryAccounts.forEach((account) => {
      paymentCalls.push(account.payments())
    })

    const payments = await Promise.all(paymentCalls)

    payments.forEach((payment) => {
      console.log(JSON.stringify(payment, null, 2))
    })
  } catch (err) {
    console.log(err)
  }
}

main()
