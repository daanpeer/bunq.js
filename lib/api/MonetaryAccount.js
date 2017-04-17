'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bunq = require('../Bunq');

var _Payments = require('./Payments');

var _Payments2 = _interopRequireDefault(_Payments);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MonetaryAccount = function () {
  function MonetaryAccount(client, params) {
    _classCallCheck(this, MonetaryAccount);

    this.client = client;
    this.params = params;
  }

  _createClass(MonetaryAccount, [{
    key: 'payments',
    value: function payments() {
      return new _Payments2.default(this.client).list(this.params.id);
    }
  }]);

  return MonetaryAccount;
}();

exports.default = MonetaryAccount;