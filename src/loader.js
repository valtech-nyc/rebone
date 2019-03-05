import Backbone from 'backbone';
import jQuery from 'jquery';
import _underscore from 'underscore';
import { syncCollections } from 'backbone-redux';
import { store } from './store/AppStore';
import { reducers } from './store/combinedReducers';
export const uuid = require('uuid/v4');

// Disable console logging unless "Debug" is passed as a URL Param
const urlParams = new URLSearchParams(window.location.search);
const debug = urlParams.get('Debug');
if (debug !== 'true') {
    console = {
        log: () => {},
        warn: () => {},
        error: () => {},
        info: () => {}
    }
}

Backbone.$ = jQuery;
export const app = app || {};
app.views = app.views || {};
app.models = app.models || {};
app.collections = app.collections || {};

// Load component files
export const requireAll = (r) => { r.keys().forEach(r); };
requireAll(require.context(`${__DIR__}/components/`, true, /\.view\.js$/));
requireAll(require.context(`${__DIR__}/components/`, true, /\.model\.js$/));
requireAll(require.context(`${__DIR__}/components/`, true, /\.collection\.js$/));

// Override template delimiters to avoid server interpolation conflicts
_underscore.templateSettings = {
    escape: /\<\@-(.+?)\@\>/g,
    interpolate: /\<\@=(.+?)\@\>/g,
    evaluate: /\<\@(.+?)\@\>/g,
};

// Export underscore with template override. Import from this file!
export const _ = { ..._underscore };

/**
 * @author Salvatore Randazzo
 */


'use strict';

/**
 * Loader
 * @returns {{init: Function}}
 * @constructor
 */
const Loader = () => {
    let components = null;
    let view = '';
    let model = '';
    let collection = '';
    const viewsInstances = [];
    const collectionMap = {};
    const subscriptions = [];

    /**
     * Initializer
     */
    const init = () => {
        Backbone.$ = $;
        components = $('[data-view]').toArray();
        const dataListeners = [];

        // Check each loaded view and associate models and/or collections if mentioned.
        components.forEach(component => {
            view =  $(component).attr('data-view');
            model = $(component).attr('data-model');
            collection = $(component).attr('data-collection');

            if (app.views[view] !== undefined) {

                if (collection === undefined) {
                    const viewInstanceWithModel = new app.views[view]({
                        el: $(component),
                        model: app.models[model] !== undefined ? new app.models[model]() : null
                    });

                    viewsInstances.push(viewInstanceWithModel);

                    // TODO: Look into adding models to the store.
                    // model && dataListeners.push(model);
                } else {
                    // Only add this instantiated collection to redux if we haven't already
                    if (!collectionMap[collection]) {
                        collectionMap[collection] = app.collections[collection] !== undefined ? new app.collections[collection]() : null;
                    }

                    const viewInstanceWithCollection = new app.views[view]({
                        el: $(component),
                        collection: collectionMap[collection]
                    });

                    viewsInstances.push(viewInstanceWithCollection);
                    collection && dataListeners.push(collection);

                    // Automatically register the view as a subscriber to receive redux store notifications when
                    // the associated collection is changed.
                    const viewId = viewInstanceWithCollection.uuid;
                    if (subscriptions.filter(item => item.topic === collection.toUpperCase()).length) {
                        subscriptions.map(item => {
                            if (item.topic === collection.toUpperCase()) {
                                if (item.subscriberIds) {
                                    item.subscriberIds.push(viewId);
                                } else {
                                    item.subscriberIds = [viewId];
                                }
                            }
                        });
                    } else {
                        subscriptions.push({ topic: collection.toUpperCase(), subscriberIds: [viewId] })
                    }
                }

            } else {
                throw new Error ('No view found for ' + view );
            }

        });

        // Load collections into store
        syncCollections(collectionMap, store, reducers);

        // Register collections as data listeners (models TBD)
        store.dispatch({ type: 'REGISTER_DATA_LISTENERS', payload: subscriptions});

        // Set app to loaded state
        store.dispatch({ type: 'APP_LOADED' });
    };

    // Public
    return {
        init: init,
        viewInstances: viewsInstances
    };
};

// // Starting the application
// window.loader = new Loader();
// window.loader.init();

export default Loader;
