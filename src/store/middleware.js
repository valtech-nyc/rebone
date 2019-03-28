/**
 * Checks the list of dataListeners and dispatches the NOTIFY_VIEW if
 * the current action type is related to the listener (a view). This allows
 * conditional rendering for views.
 * @param store
 * @returns {function(*): Function}
 */
export const notifyViews = store => next => action => {
    next(action);

    store.getState().app.dataListeners.forEach(item => {
        if (action.type.includes(`${item.topic}`)) {
            item.subscriberIds.forEach(subscriberId => {
                store.dispatch({ type: 'NOTIFY_VIEW', payload: { action: item.topic, subscriberId, data: action } });
            });
        }
    });
};