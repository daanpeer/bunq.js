'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _helpers = require('./helpers');

var _MonetaryAccounts = require('./api/MonetaryAccounts');

var _MonetaryAccounts2 = _interopRequireDefault(_MonetaryAccounts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API_SANDBOX_URL = 'https://sandbox.public.api.bunq.com';
var API_URL = 'https://api.bunq.com';
var API_VERSION = 'v1';

var Bunq = function () {
  function Bunq(options) {
    _classCallCheck(this, Bunq);

    if (!options) {
      throw Error('Please specify the required options');
    }

    var apiKey = options.apiKey,
        sandbox = options.sandbox,
        debug = options.debug,
        keyPair = options.keyPair;


    if (!apiKey) {
      throw Error('Please specify an api key in order to use the Bunq API');
    }

    if (!keyPair || !keyPair.public || !keyPair.private) {
      throw Error('Please specify an private and public key pair');
    }

    if (sandbox === undefined) {
      sandbox = true;
    }

    this.apiUrl = sandbox ? API_SANDBOX_URL : API_URL;
    this.apiKey = apiKey;
    this.keyPair = keyPair;
    this.serverPublicKey = '';
    this.installationToken = '';
    this.sessionToken = '';
    this.debug = debug;
    this.user = {};
    this.sign = _helpers.sign;
    this.fetch = _nodeFetch2.default;

    if (this.debug) {
      (0, _helpers.log)([this.keyPair]);
    }
  }

  _createClass(Bunq, [{
    key: 'setSessionToken',
    value: function setSessionToken(sessionToken) {
      this.sessionToken = sessionToken;
    }
  }, {
    key: 'device',
    value: function device(ipAddresses, description) {
      this.performRequest('POST', 'device-server', {
        secret: this.apiKey,
        description: description,
        permitted_ips: ipAddresses
      }, undefined, true);
    }
  }, {
    key: 'session',
    value: async function session() {
      var data = await this.performRequest('POST', 'session-server', { secret: this.apiKey }, { 'X-Bunq-Client-Authentication': this.installationToken }, true);

      var responseData = {
        user: data.Response[2].UserCompany,
        token: data.Response[1].Token.token
      };
      this.user = responseData.user;
      this.setSessionToken(responseData.token);
      return responseData;
    }
  }, {
    key: 'installation',
    value: async function installation() {
      var data = await this.performRequest('POST', 'installation', {
        client_public_key: this.keyPair.public
      }, undefined, false);

      this.serverPublicKey = data.Response[2].ServerPublicKey.server_public_key;
      this.installationToken = data.Response[1].Token.token;
    }
  }, {
    key: 'monetaryAccounts',
    value: function monetaryAccounts() {
      return new _MonetaryAccounts2.default(this).list();
    }
  }, {
    key: 'signHeaders',
    value: function signHeaders(headers, body, method, endpoint) {
      headers = (0, _helpers.sortObject)(headers);

      var headersToSign = method + ' ' + endpoint;
      headersToSign += '\n';
      Object.keys(headers).forEach(function (header) {
        // Only include X-Bunq, Cache-Control and User-Agent headers
        if (header.includes('X-Bunq') || header.includes('Cache-Control') || header.includes('User-Agent')) {
          headersToSign += header + ': ' + headers[header] + '\n';
        }
      });

      headersToSign += '\n';
      if (body !== undefined) {
        headersToSign += JSON.stringify(body);
      }

      if (this.debug) {
        (0, _helpers.log)(['Signing headers', headersToSign]);
      }

      return headersToSign;
    }
  }, {
    key: 'performRequest',
    value: async function performRequest(method, endpoint, body, headers, sign) {
      // signing if needed
      var requestEndpoint = '/' + API_VERSION + '/' + endpoint;
      var requestUrl = '' + this.apiUrl + requestEndpoint;

      var newHeaders = Object.assign({
        'Cache-Control': 'no-cache',
        'User-Agent': 'bunq-TestServer/1.00 sandbox/0.17b3',
        'X-Bunq-Client-Request-Id': (0, _helpers.randomString)(),
        'X-Bunq-Geolocation': '0 0 0 0 000',
        'X-Bunq-Language': 'en_US',
        'X-Bunq-Region': 'en_US'
      }, headers || {});

      if (sign) {
        var headersToSign = this.signHeaders(newHeaders, body, method, requestEndpoint);
        newHeaders['X-Bunq-Client-Signature'] = this.sign(this.keyPair.private, headersToSign);
      }

      if (this.debug) {
        (0, _helpers.log)([requestUrl, newHeaders]);
      }

      var response = await this.fetch(requestUrl, {
        method: method,
        headers: new _nodeFetch.Headers(newHeaders),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        if (this.debug) {
          (0, _helpers.log)([await response.json()]);
        }
        throw Error('Request to ' + requestUrl + ' failed');
      }

      return response.json();
    }
  }]);

  return Bunq;
}();

exports.default = Bunq;