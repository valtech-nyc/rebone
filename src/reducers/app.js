const initialState = {
    loaded: false,
    alertedListeners: [],
    dataListeners: []
};

/**
 * Dispatches the acknowledgement for a view that will react to a store update notification.
 * @param {string} viewId
 * @return {Function}
 */
export const viewAcknowledge = (viewId) => {
    return (dispatch) => {
        dispatch({ type: 'VIEW_ACKNOWLEDGED', payload: viewId });
    };
};

/**
 * Handles app level actions such as whether the application has fully loaded and
 * notifying views that their collection data has changed.
 * @param {object} state
 * @param {object} action
 * @returns {*} new state object
 */
export default function setLoaded(state = initialState, action = { type: 'NOOP' }) {
    switch (action.type) {
        case 'APP_LOADED':
            return { ...state, loaded: true };
        case 'REGISTER_DATA_LISTENERS':
            return { ...state, dataListeners: [...action.payload] };
        case 'NOTIFY_VIEW':
            return { ...state, alertedListeners: [...new Set([...state.alertedListeners, action.payload])] };
        case 'VIEW_ACKNOWLEDGED':
            return { ...state, alertedListeners: [...new Set([...state.alertedListeners])].filter(item => item.subscriberId !== action.payload) };
        default:
            return state;
    }
}
