"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducers = void 0;

var _app = _interopRequireDefault(require("../reducers/app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducers = {
  app: _app.default
};
exports.reducers = reducers;