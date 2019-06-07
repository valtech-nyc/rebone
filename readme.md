# Setup
Rebone will need you to manually import your components (views, collections, models). In your entry point, add the following:

```javascript
// Load reducers
import reducers from './reducers/combinedReducers';

// Load component files
export const requireAll = (r) => { r.keys().forEach(r); };
requireAll(require.context('./components/', true, /\.view\.js$/));
requireAll(require.context('./components/', true, /\.model\.js$/));
requireAll(require.context('./components/', true, /\.collection\.js$/));

import { Loader } from 'rebone';
Loader().init(reducers);
```

You may need to update the location of your component folder since the default is set to ./components

# Creating a template
The system is using mustache as a templating engine, for more information please have a look at https://mustache.github.io/

```html
<div class="component-posts" data-view="Posts" data-collection="Posts">
   
</div>
``` 
> Note on `data-view='Posts'` and `data-collection='Posts'`

All views should extend ComponentView which connects to the global redux store and registers the view to receive store updates for conditional rendering and prop validation:

```javascript

import { View } from 'backbone';
import { _, app, uuid } from '../index';
import $ from 'jquery';
import { store } from '../store/AppStore';
import dispatchToProps from '../store/dispatchToProps';
import { viewAcknowledge } from '../reducers/app';

export class ComponentView extends View {

    constructor (options) {
        super(options);

        // Initialize props
        this.propTypes = options.propTypes;
        this.props = options.props;

        // Assign each view a unique ID to coordinate reactive view rendering based on the redux state.
        this.uuid = uuid();

        // Subscribe to ALL store update events. For now, the views will handle filtering the actions to decide
        // if they want to render or not based on what actions have been dispatched.
        store.subscribe(this.handleStoreUpdate.bind(this));

        // If the view is instantiated sometime after the app has loaded then the state changes may be finished
        // so check if we need to go ahead with the runOnce.
        this.appLoaded();

        // Validate propTypes
        this.propTypes && this.checkProps();
    }

    /**
     * Checks if any actions were defined that need to be called via dispatch and wraps them.
     */
    handleMapDispatchToProps() {
        if (this.mapDispatchToProps) {
            this.props = { ...this.props, ...dispatchToProps(this.mapDispatchToProps) };

            // Add mapped dispatch functions to propTypes with function as type
            this.propTypes = this.propTypes ? this.propTypes : {};
            Object.keys(this.mapDispatchToProps).forEach(item => {
                this.propTypes[item] = 'function';
            });

            // Check the propTypes again since we've just added new ones
            this.checkProps();
        }
    };

    /**
     * Validate prop types if props are present.
     */
    checkProps () {
        Object.keys(this.props).map(propName => {
            const type = this.propTypes[propName];
            const propValue = this.props[propName];

            typeof propValue !== type ?
                console.warn(`${propName} requires a ${type}, instead passed ${typeof propValue}`)
                : null;
        });
    }

    /**
     * Returns an instance of the store.
     * @type {object} store
     */
    store = store;

    /**
     * Returns access to dispatch for thunks (redux actions as functions) and regular actions (objects with type property).
     * @type {function}
     */
    dispatch = store.dispatch;

    /**
     * Run onAppReady once if defined on the subclass.
     * This ensures that all collections and views have been loaded
     * and all reducers have set their initial states in the store.
     */
    appLoaded() {
        const state = store.getState();
        if (!this.loaded && state.app && state.app.loaded) {
            this.handleMapDispatchToProps();

            // Check if there is view-specific logic to execute when the store is fully loaded
            // Define onAppReady in the view to access this callback
            if (typeof this.onAppReady === 'function') {
                this.onAppReady(store);
            }
            this.loaded = true;
        }
    }

    /**
     * Returns the jQuery element of the rendered view.
     * Useful for pre-rendering a view to include as part of the render to another view.
     * @param {string} viewName
     * @param {object} options
     * @return {object} - jQuery element
     */
    renderAppView (viewName, options) {
        const { $el } = new app.views[viewName]({ ...options });

        return $el;
    }

    /**
     * Will execute each time the state is updated in the store.
     */
    handleStoreUpdate = () => {
        this.appLoaded();

        if (this.uuid) {
            const { app: { alertedListeners } } = store.getState();

            // Check if the current view needs to be notified about the store update
            if (alertedListeners.includes(this.uuid)) {
                store.dispatch(viewAcknowledge(this.uuid));

                // Execute view-specific logic (if provided) before calling render
                // Define onViewNotified in the view to access this callback
                if (typeof this.onViewNotified === 'function') {
                    this.onViewNotified();
                }

                this.render();
            }
        }

        // Check if there is view-specific logic to execute on ANY store update
        // Define onStoreUpdated in the view to access this callback
        if (typeof this.onStoreUpdated === 'function') {
            this.onStoreUpdated(store);
        }
    };

    /**
     * Sets which element in the DOM to be used as the Underscore template.
     * @param {string} templateId
     */
    setTemplate = (templateId) => {
        this.template = _.template($(`#${templateId}`).html());
    };

    /**
     * Gets an instance of a template. This usefull when you have more than just one template.
     * @param {string} templateId
     */
    getTemplateInstance = (templateId) => _.template($(`#${templateId}`).html());


}

```


Example View:

```javascript
import { ComponentView, app } from 'rebone';
import { fetchCollection } from '../../reducers/fetch';

require('./Posts.scss');

class Posts extends ComponentView {

    constructor(options) {
        super({
            ...options,
            events: {
                'click .post-button': 'buttonClicked'
            }
        });
    }

    onAppReady () {
        this.setTemplate('component-post');
        this.props.fetchCollection(this.collection);
    }

    buttonClicked (element) {
        const modelId = this.$(element.currentTarget).data('post-id');
        let model = this.collection.get(modelId);
        model.set({ title: 'random'});
    }

    render() {
        const { filter: { currentFilter} } = this.store.getState();
        const posts = this.collection.toJSON().filter(post => post.title.indexOf(currentFilter) > -1);
        this.$('.pure-g').html(this.template({ data: posts }));
    }

    /**
     * Define functions which need to be wrapped with dispatch.
     * @type {object}
     */
    mapDispatchToProps = {
        fetchCollection
    };
}

app.views.Posts = Posts;

```
