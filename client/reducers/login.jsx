import {
    START_LOGIN,
    LOGIN_SUCCESSFUL,
    LOGIN_FAILED,
    START_LOGOUT,
    UPDATE_SESSION,
    CLEAR_LOGIN,
    SET_USER_DATA
} from '../actions/login.jsx';

// This reducer returns a "login" sub-state, shape as follows
const initialState = {
    username: "",
    password: "",
    inProgress: false,
    error: {
        label: "",
        show: false
    },
    authToken: "",
    userLabel: "",
    userPicture: "",
    userLoginPicture: "",
    roles: [],
    userData: {},
    userIdentity: "",
    isSocial: false
};

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_LOGIN:
            return Object.assign({}, state, {
                username: action.username,
                password: action.password,
                error: {},
                inProgress: true
            });
        case LOGIN_SUCCESSFUL:
            return Object.assign({}, state, {
                password: "",
                authToken: action.authToken,
                userIdentity: action.userIdentity,
                userEmail: action.userEmail,
                userPicture: action.userPicture,
                userLoginPicture: action.userLoginPicture,
                userData: action.userData,
                isSocial: action.isSocial,
                error: {},
                inProgress: false
            });
        case LOGIN_FAILED:
            return Object.assign({}, state, {
                username: state.username,
                password: "",
                error: {
                    label: action.errorLabel ? action.errorLabel : "login.defaultError",
                    show: true
                },
                inProgress: false
            });
        case START_LOGOUT:
            return Object.assign({}, state, {
                password: "",
                authToken: "",
                inProgress: false
            });
        case UPDATE_SESSION:
            return Object.assign({}, state, {
                previousUsers: action.previousUsers
            });
        case CLEAR_LOGIN:
            return Object.assign({}, state, {
                error: {}
            });
        case SET_USER_DATA:
            return {
                ... state,
                userData: action.userData,
                userIdentity: action.userData.firstName || action.userData.email
            };
        default:
            return state;
    }
};

export default loginReducer;