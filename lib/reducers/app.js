"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setLoaded;
exports.viewAcknowledge = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  loaded: false,
  alertedListeners: [],
  dataListeners: []
};
/**
 * Dispatches the acknowledgement for a view that will react to a store update notification.
 * @param {string} viewId
 * @return {Function}
 */

var viewAcknowledge = function viewAcknowledge(viewId) {
  return function (dispatch) {
    dispatch({
      type: 'VIEW_ACKNOWLEDGED',
      payload: viewId
    });
  };
};
/**
 * Handles app level actions such as whether the application has fully loaded and
 * notifying views that their collection data has changed.
 * @param {object} state
 * @param {object} action
 * @returns {*} new state object
 */


exports.viewAcknowledge = viewAcknowledge;

function setLoaded() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    type: 'NOOP'
  };

  switch (action.type) {
    case 'APP_LOADED':
      return _objectSpread({}, state, {
        loaded: true
      });

    case 'REGISTER_DATA_LISTENERS':
      return _objectSpread({}, state, {
        dataListeners: [].concat(_toConsumableArray(state.dataListeners), _toConsumableArray(action.payload))
      });

    case 'NOTIFY_VIEW':
      return _objectSpread({}, state, {
        alertedListeners: _toConsumableArray(new Set([].concat(_toConsumableArray(state.alertedListeners), [action.payload])))
      });

    case 'VIEW_ACKNOWLEDGED':
      return _objectSpread({}, state, {
        alertedListeners: _toConsumableArray(new Set(_toConsumableArray(state.alertedListeners))).filter(function (item) {
          return item !== action.payload;
        })
      });

    default:
      return state;
  }
}