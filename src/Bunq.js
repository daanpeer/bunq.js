/* @flow */
/* global Response */
import fetch, { Headers } from 'node-fetch'
import { log, sign, randomString, sortObject } from './helpers'
import { BunqInterface } from './BunqInterface'
import MonetaryAccounts from './api/MonetaryAccounts'
import type { SessionResponse, InstallationResponse } from './api/responseTypes'

const API_SANDBOX_URL = 'https://sandbox.public.api.bunq.com'
const API_URL = 'https://api.bunq.com'
const API_VERSION = 'v1'

type KeyPair = {
  public: string,
  private: string,
}

type BunqOptions = {
  apiKey: string,
  sandbox?: boolean,
  debug: boolean,
  keyPair: KeyPair
}

export default class Bunq implements BunqInterface {
  apiUrl: string
  apiKey: string
  keyPair: { [string]: string }
  serverPublicKey: string
  sessionToken: string
  installationToken: string
  debug: boolean
  user: any
  sign: (privateKey: string, data: string) => string

  constructor (options: BunqOptions) {
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

    if (this.debug) {
      log([this.keyPair])
    }
  }

  setSessionToken (sessionToken: string) {
    this.sessionToken = sessionToken
  }

  async device (ipAddresses: Array<string>, description: string): Promise<any> {
    await this.performRequest(
      'POST',
      'device-server',
      {
        secret: this.apiKey,
        description: description,
        permitted_ips: ipAddresses
      },
      {'X-Bunq-Client-Authentication': this.installationToken},
      true
    )
  }

  async session (): Promise<{ user: Object, token: string }> {
    const data: SessionResponse = await this.performRequest(
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
    const data: InstallationResponse = await this.performRequest(
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
  ): Promise<Object> {
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
      log([requestUrl, newHeaders, body])
    }

    const response: Response = await fetch(requestUrl, {
      method,
      headers: new Headers(newHeaders),
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      if (this.debug) {
        log([response.json()])
      }
      throw Error(`Request to ${requestUrl} failed`)
    }

    return response.json()
  }
}
