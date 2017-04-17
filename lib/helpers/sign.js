'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sign = function sign(privateKey, data) {
  var sign = _crypto2.default.createSign('sha256');
  sign.update(data);
  return sign.sign(privateKey, 'base64');
};
exports.default = sign;