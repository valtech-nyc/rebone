"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = void 0;

var _redux = require("redux");

var _reduxDevtoolsExtension = require("redux-devtools-extension");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _middleware = require("./middleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Initialize the redux store. Reducers are loaded in the loader.js loader file.
 * @type {any}
 */
var store = (0, _redux.createStore)(function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return state;
}, (0, _reduxDevtoolsExtension.composeWithDevTools)((0, _redux.applyMiddleware)(_reduxThunk.default, _middleware.notifyViews)));
exports.store = store;