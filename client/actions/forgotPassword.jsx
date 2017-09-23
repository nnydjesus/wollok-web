import fetch from 'node-fetch';
import '../../resources/config.jsx';
import log from '../../resources/log.jsx';

export const START_FORGOT_PASSWORD = 'START_FORGOT_PASSWORD';
export const FORGOT_PASSWORD_SUCCESSFUL = 'FORGOT_PASSWORD_SUCCESSFUL';
export const FORGOT_PASSWORD_FAILED = 'FORGOT_PASSWORD_FAILED';
export const FORGOT_PASSWORD_ASYNC = 'FORGOT_PASSWORD_ASYNC';
export const CLEAR_FORGOT_PASSWORD = 'CLEAR_FORGOT_PASSWORD';

// Remember that when using redux-thunk, dispatch(...) receives functions or objects.
// To trigger "final" actions add function calls with (parameters) or plain objects.

const API_HOST = (typeof window !== "undefined" && window.__CONFIG__ ? window.__CONFIG__.apiHost : global.__CONFIG__.apiHost);

export const startForgotPassword = (email) => {
    log("info", "Forgot password started for email " + email);
    return {
        type: START_FORGOT_PASSWORD,
        email
    };
};

export const forgotPasswordSuccessful = (email) => {
    log("info", "Forgot password successful for email " + email);
    return {
        type: FORGOT_PASSWORD_SUCCESSFUL,
        email
    };
};

export const forgotPasswordFailed = (email, error) => {
    log("info", "Forgot password failed", {email, error});
    var errorId = error.id;
    if (errorId !== "invalidOperationForSocialUser") {
        errorId = "unknownError";
    }
    return {
        type: FORGOT_PASSWORD_FAILED,
        email,
        errorLabel: errorId
    };
};

export const doForgotPassword = (dispatch, getState) => {
    const email = getState().forgotPassword.email;
    const shopUrl = getState().siteConfig.shopUrl;
    fetch(API_HOST + "/userWs/forgotPassword?email=" + email + "&url=" + shopUrl, {method: 'GET'}).then((response) => {
        try {
            return response.json();
        } catch (e) {
            throw { id: "httpError", responseCode: response.status, error: e };
        }
    }).then(jsonResponse => {
        if (typeof jsonResponse.exceptionKey === "undefined") {
            dispatch(forgotPasswordSuccessful(email));
        } else {
            dispatch(forgotPasswordFailed(email, {id: jsonResponse.exceptionKey}));
        }
    }).catch(error => {
        if (error.id === undefined) {
            Object.assign({}, error, {id: "unknownError"});
        }
        dispatch(forgotPasswordFailed(email, error));
    });
    return { type: FORGOT_PASSWORD_ASYNC };
};

export const forgotPasswordAsync = (email) => {
    return (dispatch, getState) => {
        dispatch(startForgotPassword(email));
        doForgotPassword(dispatch, getState);
    };
};

export const clearForgotPassword = () => {
    return { type: CLEAR_FORGOT_PASSWORD };
};