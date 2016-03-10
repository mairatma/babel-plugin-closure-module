'use strict';

var assert = require('assert');
var babel = require('babel-core');
var plugin = require('../index');

module.exports = {
  testWrapModuleIfGoogModuleCall: function(test) {
    var code = 'goog.module("abc");';
    var result = babel.transform(code, {plugins: [plugin]});
    var expectedResult = 'goog.loadModule(function (closureExports) {\n' +
      '  goog.module("abc");\n' +
      '  return closureExports;\n' +
      '});';
    assert.strictEqual(expectedResult, result.code);
    test.done();
  },

  testWrapModuleAndRenameExportsIfGoogModuleCall: function(test) {
    var code = 'goog.module("abc");\nexports.a = 1;';
    var result = babel.transform(code, {plugins: [plugin]});
    var expectedResult = 'goog.loadModule(function (closureExports) {\n' +
      '  goog.module("abc");\n' +
      '  closureExports.a = 1;\n' +
      '  return closureExports;\n' +
      '});';
    assert.strictEqual(expectedResult, result.code);
    test.done();
  },

  testDoNothingIfNoGoogModuleCall: function(test) {
    var code = 'a("abc");\nexports.a = 1;';
    var result = babel.transform(code, {plugins: [plugin]});
    var expectedResult = 'a("abc");\nexports.a = 1;';
    assert.strictEqual(expectedResult, result.code);
    test.done();
  }
};
