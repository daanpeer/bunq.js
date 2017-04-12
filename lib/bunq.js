const fetch = require('node-fetch')
const {Headers} = require('node-fetch')
const crypto = require('crypto')
const {log, sign, randomString, sortObject} = require('./helpers')

const API_URL = 'https://sandbox.public.api.bunq.com'
const API_VERSION = 'v1'

class Bunq {
  constructor ({apiKey, keyPair, debug = false}) {

    if (apiKey === undefined) {
      throw Error('Please specify an api key in order to use the Bunq API')
    }

    this.apiKey = apiKey
    this.keyPair = keyPair
    this.serverPublicKey = ''
    this.installationToken = ''
    this.sessionToken = ''
    this.debug = debug

    if (this.debug) {
      log([this.keyPair]);
    }
  }

  setSessionToken (sessionToken) {
    this.sessionToken = sessionToken;
  }

  async device ({ipAddresses, description}) {
    await this.performRequest({
      method: 'POST',
      endpoint: 'device-server',
      sign: true,
      headers: {
        'X-Bunq-Client-Authentication': this.installationToken
      },
      body: {
        secret: this.apiKey,
        description: description,
        permitted_ips: ipAddresses
      }
    })
  }

  async session () {
    const data = await this.performRequest({
      method: 'POST',
      endpoint: 'session-server',
      sign: true,
      headers: {
        'X-Bunq-Client-Authentication': this.installationToken
      },
      body: {
        secret: this.apiKey
      }
    })

    const responseData = {
      user: data.Response[2].UserCompany,
      token: data.Response[1].Token.token
    }

    this.setSessionToken(responseData.token);
  }

  async installation () {
    const data = await this.performRequest({
      method: 'POST',
      endpoint: 'installation',
      body: {
        client_public_key: this.keyPair.public
      },
      sign: false
    })

    this.serverPublicKey = data.Response[2].ServerPublicKey.server_public_key
    this.installationToken = data.Response[1].Token.token
  }

  async listMonetaryAccounts (userId) {
    const data = await this.performRequest({
      method: 'GET',
      endpoint: `user/${userId}/monetary-account`,
      sign: true,
      headers: {
        'X-Bunq-Client-Authentication': this.sessionToken,
        'Content-Type': 'application/json'
      }
    })
    return data.Response[0]
  }

  signHeaders (headers, body, method, endpoint) {
    let headersToSign = `${method} ${endpoint}`
    headersToSign += '\n'
    Object.keys(headers).forEach((header) => {
      // Only include X-Bunq, Cache-Control and User-Agent headers
      if (header.includes('X-Bunq') || header.includes('Cache-Control') || header.includes('User-Agent')) {
        headersToSign += `${header}: ${headers[header]}\n`
      }
    })

    headersToSign += '\n'
    if (body !== undefined) {
      headersToSign += JSON.stringify(body)
    }

    if (this.debug) {
      log(['Signing headers', headersToSign])
    }

    return sign(this.keyPair.private, headersToSign)
  }

  async performRequest ({method, endpoint, body, headers, sign}) {
    // signing if needed
    const requestEndpoint = `/${API_VERSION}/${endpoint}`
    const requestUrl = `${API_URL}${requestEndpoint}`

    const newHeaders = sortObject(Object.assign({
      'Cache-Control': 'no-cache',
      'User-Agent': 'bunq-TestServer/1.00 sandbox/0.17b3',
      'X-Bunq-Client-Request-Id': randomString(),
      'X-Bunq-Geolocation': '0 0 0 0 000',
      'X-Bunq-Language': 'en_US',
      'X-Bunq-Region': 'en_US'
    }, headers || {}))

    if (sign) {
      newHeaders['X-Bunq-Client-Signature'] = await this.signHeaders(newHeaders, body, method, requestEndpoint)
    }

    if (this.debug) {
      log([requestUrl, newHeaders])
    }

    const response = await fetch(requestUrl, {
      method,
      headers: new Headers(newHeaders),
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw Error(`Request to ${requestEndpoint} failed`)
    }

    return response.json()
  }
}

module.exports = Bunq
