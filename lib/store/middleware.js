"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifyViews = void 0;

/**
 * Checks the list of dataListeners and dispatches the NOTIFY_VIEW if
 * the current action type is related to the listener (a view). This allows
 * conditional rendering for views.
 * @param store
 * @returns {function(*): Function}
 */
var notifyViews = function notifyViews(store) {
  return function (next) {
    return function (action) {
      next(action);
      store.getState().app.dataListeners.forEach(function (item) {
        if (action.type.includes("".concat(item.topic))) {
          item.subscriberIds.forEach(function (subscriberId) {
            store.dispatch({
              type: 'NOTIFY_VIEW',
              payload: {
                action: item.topic,
                subscriberId: subscriberId,
                data: action
              }
            });
          });
        }
      });
    };
  };
};

exports.notifyViews = notifyViews;