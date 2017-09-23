import { START_FORGOT_PASSWORD, FORGOT_PASSWORD_SUCCESSFUL, FORGOT_PASSWORD_FAILED, FORGOT_PASSWORD_ASYNC, CLEAR_FORGOT_PASSWORD } from '../actions/forgotPassword.jsx';

// This reducer returns a "forgotPassword" sub-state, shape as follows
const initialState = {
    email: "",
    error: {
        label: "",
        show: false
    },
    inProgress: false,
    finished: false
};

const forgotPasswordReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_FORGOT_PASSWORD:
            return Object.assign({}, state, {
                email: action.email,
                error: {},
                inProgress: true,
                finished: false
            });
        case FORGOT_PASSWORD_SUCCESSFUL:
            return Object.assign({}, state, {
                email: "",
                error: {},
                inProgress: false,
                finished: true
            });
        case FORGOT_PASSWORD_FAILED:
            return Object.assign({}, state, {
                email: "",
                error: {
                    label: "forgotPassword.error." + (action.errorLabel ? action.errorLabel : "defaultError"),
                    show: true
                },
                inProgress: false,
                finished: true
            });
        case FORGOT_PASSWORD_ASYNC:
            return Object.assign({}, state, {
                email: action.email,
                inProgress: true
            });
        case CLEAR_FORGOT_PASSWORD:
            return Object.assign({}, state, {
                email: "",
                error: {},
                inProgress: false,
                finished: false
            });
        default:
            return state;
    }
};

export default forgotPasswordReducer;