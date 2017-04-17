 /* @flow */
import fetch, { Headers } from 'node-fetch'
import { log, sign, randomString, sortObject } from './helpers'
import MonetaryAccounts from './api/MonetaryAccounts'

const API_SANDBOX_URL = 'https://sandbox.public.api.bunq.com'
const API_URL = 'https://api.bunq.com'
const API_VERSION = 'v1'

export interface BunqInterface {
  sessionToken: string,
  user: any,
  performRequest (
    method: string,
    endpoint: string,
    body?: { [string]: any },
    header?: { [string]: string },
    sign: boolean
  ): Promise<any>
}

export default class Bunq implements BunqInterface {
  apiUrl: string
  apiKey: string
  keyPair: Object
  serverPublicKey: string
  sessionToken: string
  installationToken: string
  debug: boolean
  user: any
  sign: any
  fetch: any

  constructor (options: { apiKey: string, sandbox: boolean, debug: boolean, keyPair: {[string]: string} }) {
    if (!options) {
      throw Error('Please specify the required options')
    }

    let {
      apiKey,
      sandbox,
      debug,
      keyPair
    } = options

    if (!apiKey) {
      throw Error('Please specify an api key in order to use the Bunq API')
    }

    if (!keyPair || !keyPair.public || !keyPair.private) {
      throw Error('Please specify an private and public key pair')
    }

    if (sandbox === undefined) {
      sandbox = true
    }

    this.apiUrl = sandbox ? API_SANDBOX_URL : API_URL
    this.apiKey = apiKey
    this.keyPair = keyPair
    this.serverPublicKey = ''
    this.installationToken = ''
    this.sessionToken = ''
    this.debug = debug
    this.user = {}
    this.sign = sign
    this.fetch = fetch

    if (this.debug) {
      log([this.keyPair])
    }
  }

  setSessionToken (sessionToken: string) {
    this.sessionToken = sessionToken
  }

  device (ipAddresses: Array<string>, description: string): void {
    this.performRequest(
      'POST',
      'device-server',
      {
        secret: this.apiKey,
        description: description,
        permitted_ips: ipAddresses
      },
      undefined,
      true
    )
  }

  async session (): { [any]: any } {
    const data: { [any]: any } = await this.performRequest(
      'POST',
      'session-server',
      {secret: this.apiKey},
      {'X-Bunq-Client-Authentication': this.installationToken},
      true
    )

    const responseData = {
      user: data.Response[2].UserCompany,
      token: data.Response[1].Token.token
    }
    this.user = responseData.user
    this.setSessionToken(responseData.token)
    return responseData
  }

  async installation (): Promise<any> {
    const data: { [any]: any } = await this.performRequest(
      'POST',
      'installation',
      {
        client_public_key: this.keyPair.public
      },
      undefined,
      false
    )

    this.serverPublicKey = data.Response[2].ServerPublicKey.server_public_key
    this.installationToken = data.Response[1].Token.token
  }

  monetaryAccounts () {
    return new MonetaryAccounts(this).list()
  }

  signHeaders (headers: { [string]: string }, body?: { [string]: any }, method: string, endpoint: string) {
    headers = sortObject(headers)

    let headersToSign = `${method} ${endpoint}`
    headersToSign += '\n'
    Object.keys(headers).forEach((header: string) => {
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

    return headersToSign
  }

  async performRequest (
    method: string,
    endpoint: string,
    body?: { [string]: any },
    headers?: { [string]: string },
    sign: boolean
  ): Promise<any> {
    // signing if needed
    const requestEndpoint = `/${API_VERSION}/${endpoint}`
    const requestUrl = `${this.apiUrl}${requestEndpoint}`

    const newHeaders: { [string]: string } = Object.assign({
      'Cache-Control': 'no-cache',
      'User-Agent': 'bunq-TestServer/1.00 sandbox/0.17b3',
      'X-Bunq-Client-Request-Id': randomString(),
      'X-Bunq-Geolocation': '0 0 0 0 000',
      'X-Bunq-Language': 'en_US',
      'X-Bunq-Region': 'en_US'
    }, headers || {})

    if (sign) {
      const headersToSign = this.signHeaders(newHeaders, body, method, requestEndpoint)
      newHeaders['X-Bunq-Client-Signature'] = this.sign(this.keyPair.private, headersToSign)
    }

    if (this.debug) {
      log([requestUrl, newHeaders])
    }

    const response: { [any]: any } = await this.fetch(requestUrl, {
      method,
      headers: new Headers(newHeaders),
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      if (this.debug) {
        log([await response.json()])
      }
      throw Error(`Request to ${requestUrl} failed`)
    }

    return response.json()
  }
}
