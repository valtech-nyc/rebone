import { store } from '../store/AppStore';

/**
 * Takes an object with form key => function and wraps each function in a dispatch.
 * @param dispatch
 * @return {function}
 */
const mapDispatchToProps = dispatch => dispatchables => {
    const props = {};

    Object.keys(dispatchables).forEach(dispatchableFunctionName => {
        props[dispatchableFunctionName] = (arg1, ...rest) => {
            return dispatch(dispatchables[dispatchableFunctionName](arg1, ...rest));
        }
    });

    return props;
};

export default mapDispatchToProps(store.dispatch);