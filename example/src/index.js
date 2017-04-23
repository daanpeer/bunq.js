/* @flow */
import Bunq from '../../lib'
import ursa from 'ursa'
import config from './config.js'

const generateKeyPair = (): { public: string, private: string } => {
  const keyPair: Object = ursa.generatePrivateKey(2048)
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
    await bunq.device(config.ipAddresses, 'Bunq example')
    await bunq.session()

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
