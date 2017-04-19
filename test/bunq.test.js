/* global describe, it */
const Bunq = require('../lib/bunq.js').default
const sign = require('../lib/helpers/sign')
const {monetaryResponse, paymentsResponse} = require('./responses')
const sinon = require('sinon')
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
  const stub = sinon.stub({sign}, sign).returns('encrypted')
  const bunq = new Bunq(config)
  bunq.sign = stub
  bunq.user = {id: 123}
  return bunq
}

// @todo disable sandbox url so no real request can be done
// @todo split file into api file and basic bunq tests
// @todo add tests for installation, device and session requests

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

  it('Should add the signed header', async () => {
    nock(API_URL)
      .post('/v1/device-server')
      .reply(200, function (uri, requestBody) {
        assert.isDefined(this.req.headers, 'x-bunq-client-signature')
        return {}
      })

    const bunq = bunqInstance()
    bunq.installationToken = '123'
    await bunq.device([], 'wee')
  })

  it('Should should sign headers correctly', async () => {
    const bunq = bunqInstance()

    const url = 'http://example.com/test'
    const method = 'POST'

    const headers = {
      'X-Bunq-test': 'test',
      'test-header': 'test',
      'User-Agent': 'test',
      'Cache-Control': 'test'
    }

    const body = {
      'test': 'test'
    }

    let expectedHeadersToSign = `${method} ${url}`
    expectedHeadersToSign += '\n'
    expectedHeadersToSign += 'Cache-Control: test\n'
    expectedHeadersToSign += 'User-Agent: test\n'
    expectedHeadersToSign += 'X-Bunq-test: test\n'
    expectedHeadersToSign += '\n'
    expectedHeadersToSign += JSON.stringify(body)

    const headersToSign = bunq.signHeaders(headers, body, method, url)

    assert.equal(headersToSign, expectedHeadersToSign)
  })

  it('Should retrieve monetaryAccounts', async () => {
    const bunq = bunqInstance()

    nock(API_URL)
      .get('/v1/user/123/monetary-account')
      .reply(200, monetaryResponse)

    const data = await bunq.monetaryAccounts()

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

    const data = await bunq.monetaryAccounts()
    const payments = await data[0].payments()

    assert.isArray(payments)
    assert.deepEqual(paymentsResponse.Response, payments)
  })
})
