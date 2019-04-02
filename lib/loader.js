"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Loader = exports._ = exports.app = exports.uuid = void 0;

var _backbone = _interopRequireDefault(require("backbone"));

var _jquery = _interopRequireDefault(require("jquery"));

var _underscore2 = _interopRequireDefault(require("underscore"));

var _backboneRedux = require("backbone-redux");

var _AppStore = require("./store/AppStore");

var _combinedReducers = require("./store/combinedReducers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var uuid = require('uuid/v4');

exports.uuid = uuid;
_backbone.default.$ = _jquery.default;
var $ = _backbone.default.$;
var app = app || {};
exports.app = app;
app.views = app.views || {};
app.models = app.models || {};
app.collections = app.collections || {}; // Override template delimiters to avoid server interpolation conflicts

_underscore2.default.templateSettings = {
  escape: /\<\@-(.+?)\@\>/g,
  interpolate: /\<\@=(.+?)\@\>/g,
  evaluate: /\<\@(.+?)\@\>/g
}; // Export underscore with template override. Import from this file!

var _ = _objectSpread({}, _underscore2.default);
/**
 * @author Salvatore Randazzo
 */


exports._ = _;
'use strict';
/**
 * Loader
 * @returns {{init: Function}}
 * @constructor
 */


var Loader = function Loader() {
  var components = null;
  var view = '';
  var model = '';
  var collection = '';
  var viewsInstances = [];
  var collectionMap = {};
  var subscriptions = [];
  /**
   * Initializer
   * @param {object} externalReducers
   */

  var init = function init() {
    var externalReducers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _backbone.default.$ = $;
    components = $('[data-view]').toArray();
    var dataListeners = []; // Check each loaded view and associate models and/or collections if mentioned.

    components.forEach(function (component) {
      view = $(component).attr('data-view');
      model = $(component).attr('data-model');
      collection = $(component).attr('data-collection');

      if (app.views[view] !== undefined) {
        if (collection === undefined) {
          var viewInstanceWithModel = new app.views[view]({
            el: $(component),
            model: app.models[model] !== undefined ? new app.models[model]() : null
          });
          viewsInstances.push(viewInstanceWithModel); // TODO: Look into adding models to the store.
          // model && dataListeners.push(model);
        } else {
          // Only add this instantiated collection to redux if we haven't already
          if (!collectionMap[collection]) {
            collectionMap[collection] = app.collections[collection] !== undefined ? new app.collections[collection]() : null;
          }

          var viewInstanceWithCollection = new app.views[view]({
            el: $(component),
            collection: collectionMap[collection]
          });
          viewsInstances.push(viewInstanceWithCollection);
          collection && dataListeners.push(collection); // Automatically register the view as a subscriber to receive redux store notifications when
          // the associated collection is changed.

          var viewId = viewInstanceWithCollection.uuid;

          if (subscriptions.filter(function (item) {
            return item.topic === collection.toUpperCase();
          }).length) {
            subscriptions.map(function (item) {
              if (item.topic === collection.toUpperCase()) {
                if (item.subscriberIds) {
                  item.subscriberIds.push(viewId);
                } else {
                  item.subscriberIds = [viewId];
                }
              }
            });
          } else {
            subscriptions.push({
              topic: collection.toUpperCase(),
              subscriberIds: [viewId]
            });
          }
        }
      } else {
        throw new Error('No view found for ' + view);
      }
    }); // Load collections into store

    (0, _backboneRedux.syncCollections)(collectionMap, _AppStore.store, _objectSpread({}, _combinedReducers.reducers, externalReducers)); // Register collections as data listeners (models TBD)

    _AppStore.store.dispatch({
      type: 'REGISTER_DATA_LISTENERS',
      payload: subscriptions
    }); // Set app to loaded state


    _AppStore.store.dispatch({
      type: 'APP_LOADED'
    });
  }; // Public


  return {
    init: init,
    viewInstances: viewsInstances
  };
};

exports.Loader = Loader;