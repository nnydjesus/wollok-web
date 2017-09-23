import { expect } from 'chai';
import { spy } from 'sinon';

const thunk = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState)
    }

    return next(action)
};

const create = () => {
    const store = {
        getState: spy(() => ({})),
        dispatch: spy(),
    };
    const next = spy();

    const invoke = (action) => thunk(store)(next)(action);

    return {store, next, invoke}
};

describe('thunk middleware', function () {
    it("passes through non-function action", () => {
        const {next, invoke} = create();
        const action = {type: 'TEST'};
        invoke(action);
        expect(next.calledWith(action));
    });

    it('calls the function', () => {
        const {invoke} = create();
        const fn = spy();
        invoke(fn);
        expect(fn.called);
    });

    it('passes dispatch and getState', () => {
        const {store, invoke} = create();
        invoke((dispatch, getState) => {
            dispatch('TEST DISPATCH');
            getState();
        });
        expect(store.dispatch.calledWith('TEST DISPATCH'));
        expect(store.getState.called);
    });
});