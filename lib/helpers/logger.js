'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var log = function log(data) {
  console.log('==============');
  data.forEach(function (item) {
    var line = void 0;
    if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
      line = JSON.stringify(item, null, 2);
    } else {
      line = item;
    }
    console.log(line);
  });
  console.log('==============');
};

exports.default = log;