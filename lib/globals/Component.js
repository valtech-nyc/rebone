"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComponentView = void 0;

var _backbone = require("backbone");

var _loader = require("../loader");

var _jquery = _interopRequireDefault(require("jquery"));

var _AppStore = require("../store/AppStore");

var _dispatchToProps = _interopRequireDefault(require("../store/dispatchToProps"));

var _app = require("../reducers/app");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ComponentView =
/*#__PURE__*/
function (_View) {
  _inherits(ComponentView, _View);

  function ComponentView(options) {
    var _this;

    _classCallCheck(this, ComponentView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ComponentView).call(this, options)); // Initialize props

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "store", _AppStore.store);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "dispatch", _AppStore.store.dispatch);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleStoreUpdate", function () {
      _this.appLoaded();

      if (_this.uuid) {
        var _store$getState = _AppStore.store.getState(),
            alertedListeners = _store$getState.app.alertedListeners; // Check if the current view needs to be notified about the store update


        if (alertedListeners.map(function (item) {
          return item.subscriberId;
        }).includes(_this.uuid)) {
          var contextAction = alertedListeners.filter(function (item) {
            return item.subscriberId === _this.uuid;
          });
          var actionName = contextAction[0].action;
          var actionData = contextAction[0].data;

          _AppStore.store.dispatch((0, _app.viewAcknowledge)(_this.uuid)); // Execute view-specific logic (if provided) before calling render
          // Define onViewNotified in the view to access this callback and
          // pass the action name and data that resulted in the notification.


          if (typeof _this.onViewNotified === 'function') {
            _this.onViewNotified(actionName, actionData);
          }

          _this.render();
        }
      } // Check if there is view-specific logic to execute on ANY store update
      // Define onStoreUpdated in the view to access this callback


      if (typeof _this.onStoreUpdated === 'function') {
        _this.onStoreUpdated(_AppStore.store);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setTemplate", function (templateId) {
      _this.template = _loader._.template((0, _jquery.default)("#".concat(templateId)).html());
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getTemplateInstance", function (templateId) {
      return _loader._.template((0, _jquery.default)("#".concat(templateId)).html());
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_", _loader._);

    _this.propTypes = options.propTypes;
    _this.props = options.props; // Assign each view a unique ID to coordinate reactive view rendering based on the redux state.

    _this.uuid = (0, _loader.uuid)(); // Subscribe to ALL store update events. For now, the views will handle filtering the actions to decide
    // if they want to render or not based on what actions have been dispatched.

    _AppStore.store.subscribe(_this.handleStoreUpdate.bind(_assertThisInitialized(_assertThisInitialized(_this)))); // If the view is instantiated sometime after the app has loaded then the state changes may be finished
    // so check if we need to go ahead with the runOnce.


    _this.appLoaded(); // Validate propTypes


    _this.propTypes && _this.checkProps();
    return _this;
  }
  /**
   * Checks if any actions were defined that need to be called via dispatch and wraps them.
   */


  _createClass(ComponentView, [{
    key: "handleMapDispatchToProps",
    value: function handleMapDispatchToProps() {
      var _this2 = this;

      if (this.mapDispatchToProps) {
        this.props = _objectSpread({}, this.props, (0, _dispatchToProps.default)(this.mapDispatchToProps)); // Add mapped dispatch functions to propTypes with function as type

        this.propTypes = this.propTypes ? this.propTypes : {};
        Object.keys(this.mapDispatchToProps).forEach(function (item) {
          _this2.propTypes[item] = 'function';
        }); // Check the propTypes again since we've just added new ones

        this.checkProps();
      }
    }
  }, {
    key: "checkProps",

    /**
     * Validate prop types if props are present.
     */
    value: function checkProps() {
      var _this3 = this;

      Object.keys(this.props).map(function (propName) {
        var type = _this3.propTypes[propName];
        var propValue = _this3.props[propName];
        _typeof(propValue) !== type ? console.warn("".concat(propName, " requires a ").concat(type, ", instead passed ").concat(_typeof(propValue))) : null;
      });
    }
    /**
     * Returns an instance of the store.
     * @type {object} store
     */

  }, {
    key: "appLoaded",

    /**
     * Run onAppReady once if defined on the subclass.
     * This ensures that all collections and views have been loaded
     * and all reducers have set their initial states in the store.
     */
    value: function appLoaded() {
      var state = _AppStore.store.getState();

      if (!this.loaded && state.app && state.app.loaded) {
        this.loaded = true;
        this.handleMapDispatchToProps(); // Check if there is view-specific logic to execute when the store is fully loaded
        // Define onAppReady in the view to access this callback

        if (typeof this.onAppReady === 'function') {
          this.onAppReady(_AppStore.store);
        }
      }
    }
    /**
     * Returns the jQuery element of the rendered view.
     * Useful for pre-rendering a view to include as part of the render to another view.
     * @param {string} viewName
     * @param {object} options
     * @return {object} - jQuery element
     */

  }, {
    key: "renderAppView",
    value: function renderAppView(viewName, options) {
      var _ref = new _loader.app.views[viewName](_objectSpread({}, options)),
          $el = _ref.$el;

      return $el;
    }
    /**
     * Will execute each time the state is updated in the store.
     */

  }]);

  return ComponentView;
}(_backbone.View);

exports.ComponentView = ComponentView;