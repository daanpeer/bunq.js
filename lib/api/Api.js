'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bunq = require('../Bunq');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Api = function () {
  function Api(client) {
    _classCallCheck(this, Api);

    this.client = client;
  }

  _createClass(Api, [{
    key: 'get',
    value: async function get(endpoint, body) {
      var data = await this.client.performRequest('GET', endpoint, body, {
        'X-Bunq-Client-Authentication': this.client.sessionToken,
        'Content-Type': 'application/json'
      }, true);

      if (!data.Response) {
        throw Error('Coudln\'t read response');
      }

      return data;
    }
  }]);

  return Api;
}();

module.exports = Api;