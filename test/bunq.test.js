const Bunq = require('../lib/bunq.js')
const sign = require('../lib/helpers/sign')
const Payments = require('../lib/api/Payments');

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

describe('Bunq api', () => {

  beforeEach(() => {
    const stub = sinon.stub({sign}, sign)
    const bunq = new Bunq(config)
    bunq.sign = stub
    bunq.user = {id: 123}
    this.bunq = bunq
  })

  it('Should retrieve monetaryAccounts', async () => {
    nock(API_URL)
      .get('/v1/user/123/monetary-account')
      .reply(200, monetaryResponse)

    const data = await this.bunq.monetaryAccounts().list()

    assert.isArray(data)
    assert.typeOf(data[0], 'Object')
  })

  it('Should retrieve payments based on a monetary account', async () => {
    nock(API_URL)
      .get('/v1/user/123/monetary-account')
      .reply(200, monetaryResponse)

    nock(API_URL)
      .get('/v1/user/123/monetary-account/1871/payment')
      .reply(200, paymentsResponse)

    const data = await this.bunq.monetaryAccounts().list()
    const payments = await data[0].payments()

    assert.isArray(payments)
    assert.deepEqual(paymentsResponse.Response, payments);
  })

})