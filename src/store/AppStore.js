import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { notifyViews } from './middleware';

/**
 * Initialize the redux store. Reducers are loaded in the loader.js loader file.
 * @type {any}
 */
export const store = createStore(
    (state = {}) => state,
    compose(
        applyMiddleware(thunk, notifyViews),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);
