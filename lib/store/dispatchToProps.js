"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AppStore = require("../store/AppStore");

/**
 * Takes an object with form key => function and wraps each function in a dispatch.
 * @param dispatch
 * @return {function}
 */
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return function (dispatchables) {
    var props = {};
    Object.keys(dispatchables).forEach(function (dispatchableFunctionName) {
      props[dispatchableFunctionName] = function (arg1) {
        for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          rest[_key - 1] = arguments[_key];
        }

        return dispatch(dispatchables[dispatchableFunctionName].apply(dispatchables, [arg1].concat(rest)));
      };
    });
    return props;
  };
};

var _default = mapDispatchToProps(_AppStore.store.dispatch);

exports.default = _default;