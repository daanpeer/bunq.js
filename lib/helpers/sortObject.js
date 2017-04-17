"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var sortObject = function sortObject(object) {
  var sortedObject = {};
  Object.keys(object).sort().forEach(function (key) {
    sortedObject[key] = object[key];
  });
  return sortedObject;
};

exports.default = sortObject;