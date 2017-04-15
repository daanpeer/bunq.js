const Bunq = require('../lib/bunq.js')
const sign = require('../lib/helpers/sign')
const Payments = require('../lib/api/Payments')

const {monetaryResponse, paymentsResponse} = require('./responses')

const mockery = require('mockery')
const sinon = require('sinon')
const fetch = require('node-fetch')
const nock = require('nock')
const {assert} = require('chai')

const config = {
  apiKey: '123',
  keyPair: {
    public: '123',
    private: '123'
  }
}

const API_URL = 'https://sandbox.public.api.bunq.com'

const bunqInstance = () => {
  const stub = sinon.stub({sign}, sign)
  const bunq = new Bunq(config)
  bunq.sign = stub
  bunq.user = {id: 123}
  return bunq
}

describe('Bunq api', () => {

  it('Should throw an error when no options are specified', () => {
    assert.throws(() => new Bunq(), 'Please specify the required options')
  })

  it('Should throw an error when no keypair is specified', () => {
    assert.throws(() => new Bunq({apiKey: '123'}), 'Please specify an private and public key pair')
  })

  it('Should throw an error when no api key is specified', () => {
    assert.throws(() => new Bunq({}), 'Please specify an api key in order to use the Bunq API')
  })

  it('Should switch to sandbox by default', () => {
    const bunq = new Bunq({apiKey: '123', keyPair: {public: '123', private: '123'}})
    assert.equal(bunq.apiUrl, API_URL)
  })

  it('Should should sign headers correctly', async () => {
    // assert that headers are sorted
    // assert that the sign method is called with the sorted headers
    // assert that the new header is added
    // assert that only x-bunq, cache-control and user-agent headers are added

    // const headers = {
    // };
    //
    // this.bunq.signHeaders()
  })

  it('Should retrieve monetaryAccounts', async () => {
    const bunq = bunqInstance()

    nock(API_URL)
      .get('/v1/user/123/monetary-account')
      .reply(200, monetaryResponse)

    const data = await bunq.monetaryAccounts().list()

    assert.isArray(data)
    assert.typeOf(data[0], 'Object')
  })

  it('Should retrieve payments based on a monetary account', async () => {
    const bunq = bunqInstance()

    nock(API_URL)
      .get('/v1/user/123/monetary-account')
      .reply(200, monetaryResponse)

    nock(API_URL)
      .get('/v1/user/123/monetary-account/1871/payment')
      .reply(200, paymentsResponse)

    const data = await bunq.monetaryAccounts().list()
    const payments = await data[0].payments()

    assert.isArray(payments)
    assert.deepEqual(paymentsResponse.Response, payments)
  })

})
