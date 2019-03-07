import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from'redux-devtools-extension';
import thunk from 'redux-thunk';
import { notifyViews } from './middleware';

/**
 * Initialize the redux store. Reducers are loaded in the loader.js loader file.
 * @type {any}
 */
export const store = createStore(
    (state = {}) => state,
    composeWithDevTools(
        applyMiddleware(thunk, notifyViews)
    )
);
