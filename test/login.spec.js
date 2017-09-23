import { expect } from 'chai';
import { spy } from 'sinon';
import nock from 'nock';
import * as loginActions from '../client/actions/login.jsx';

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

describe('login.jsx', function () {
    before(() => {
        nock.disableNetConnect();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it("passes through loginSuccessful and gets GET_USER_DATA action", () => {
        const logRequest = nock('http://sample.dashboard.url')
            .post('/api/log')
            .reply(200, { body: {} });
        const userDataRequest = nock('http://test.api.url')
            .get('/userWs/loggedUser')
            .reply(200, { body: {
                "id": 123456789,
                "firstName": "First Name",
                "lastName": "Last Name",
                "birthDate": null,
                "email": "test.email@email.address",
                "dni": null,
                "phone": null,
                "preferences": [],
                "phoneVerified": false,
                "isSocial": false
            } });
        const {store, next, invoke} = create();
        let returnedAction = {};
        invoke((dispatch, getState) => {
            returnedAction = loginActions.loginSuccessful(dispatch, "tokenType", "accessToken", "refreshToken", "userIdentity", "userEmail", "roles", "http://sample.dashboard.url");
            dispatch(returnedAction);
        });
        expect(store.dispatch.called);
        expect(next.called);
        expect(logRequest.isDone());
        expect(userDataRequest.isDone());
        expect(returnedAction).to.be.an("object");
        expect(returnedAction).to.have.property("type", "GET_USER_DATA");
    });
});