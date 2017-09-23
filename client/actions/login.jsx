import fetch from 'node-fetch';
import { sessionUpdate, sessionRetrieve } from '../../resources/sessionUpdate.jsx';
import '../../resources/config.jsx';
import log from '../../resources/log.jsx';

export const START_LOGIN = 'START_LOGIN';
export const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const START_LOGOUT = 'START_LOGOUT';
export const UPDATE_SESSION = 'UPDATE_SESSION';
export const CLEAR_LOGIN = 'CLEAR_LOGIN';

export const SET_USER_DATA = 'SET_USER_DATA';

import { setLocale } from 'react-redux-i18n';

import lodash from 'lodash';

// Remember that when using redux-thunk, dispatch(...) receives functions or objects.
// To trigger "final" actions add function calls with (parameters) or plain objects.

const API_HOST = (typeof window !== "undefined" && window.__CONFIG__ ? window.__CONFIG__.apiHost : global.__CONFIG__.apiHost);

export const startLogin = (username, password) => {
    return {
        type: START_LOGIN,
        username,
        password
    };
};

export const loginSuccessful = (dispatch, tokenType, accessToken, refreshToken, userIdentity, userEmail, roles, dashboardUrl) => {
    var successfulLoginAction = {
        type: LOGIN_SUCCESSFUL,
        tokenType,
        accessToken,
        refreshToken,
        authToken: tokenType + " " + accessToken,
        userIdentity,
        userEmail,
        userPicture: "",
        roles,
        isSocial: false
    };
    return successfulLoginAction;
};

export const getUserData = (dispatch, successfulLoginAction, dashboardUrl) => {
    let headers = {
        "Authorization": successfulLoginAction.tokenType + " " + successfulLoginAction.accessToken,
        "X-Client-Hostname": dashboardUrl
    };
    fetch(API_HOST + "/userWs/loggedUser", { method: "GET", headers }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw {id: "login.error.userDataError"};
        }
    }).then(json => {
        let userData = JSON.parse(JSON.stringify(json));
        if (userData.error) {
            log("warning", "Error retrieving user data", { userEmail: successfulLoginAction.userEmail, fbUserId: fbUserId });
            successfulLoginAction.userData = {};
        } else {
            successfulLoginAction.userData = userData;
        }
        successfulLoginAction.userIdentity = (userData.firstName ? userData.firstName : successfulLoginAction.userIdentity);
        var jsonToSend = {
            login: {
                tokenType: successfulLoginAction.tokenType,
                accessToken: successfulLoginAction.accessToken,
                refreshToken: successfulLoginAction.refreshToken,
                authToken: successfulLoginAction.authToken,
                userIdentity: successfulLoginAction.userIdentity,
                userEmail: successfulLoginAction.userEmail,
                userPicture: successfulLoginAction.userPicture,
                userLoginPicture: successfulLoginAction.userLoginPicture,
                roles: successfulLoginAction.roles,
                isSocial: successfulLoginAction.isSocial,
                dashboardUrl
            },
            userData: successfulLoginAction.userData
        };
        sessionUpdate(jsonToSend);
        const userDefinedLocale = lodash.find(userData.preferences, {key: 'dashboard-locale'});
        if (userDefinedLocale !== undefined && userDefinedLocale !== null) {
            dispatch(setLocale(userDefinedLocale.value));
        }
        return dispatch(successfulLoginAction);
    }).catch(err => {
        return dispatch(loginFailed(err));
    });
    return { type: "GET_USER_DATA" };
};

export const facebookLoginSuccessful = (dispatch, getState, facebookResponse) => {
    const facebookAccessToken = facebookResponse.accessToken;
    // Get app login token from Facebook access token
    const body = "access_token=" + facebookAccessToken;
    const postHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body, "utf8")
    };
    const shopUrl = getState().siteConfig.shopUrl;
    fetch(API_HOST + "/j_spring_security_facebook_json?url=" + shopUrl, {method: 'POST', body: body, headers: postHeaders}).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            dispatch(loginFailed({id: "login.error.facebookAuthHttpError"}));
        }
    }).then(jsonResponse => {
        log("info", "Facebook Login successful", { fbId: facebookResponse.userId, userEmail: facebookResponse.email });
        facebookAuthSuccessful(dispatch, jsonResponse, facebookResponse, shopUrl);
    }).catch(err => {
        err.id = "login.error.facebookAuthError";
        log("err", "Facebook Login error", { fbId: facebookResponse.userId, err });
        dispatch(loginFailed(err));
    });
    return { type: "FACEBOOK_LOGIN_STAGE_1" };
};

export const facebookLoginSuccessfulAsync = (facebookResponse) => {
    return (dispatch, getState) => {
        facebookLoginSuccessful(dispatch, getState, facebookResponse);
    };
};

export const facebookAuthSuccessful = (dispatch, jsonResponse, facebookResponse, dashboardUrl) => {
    const tokenType = jsonResponse.token_type;
    const accessToken = jsonResponse.access_token;
    const refreshToken = jsonResponse.refresh_token;
    const roles = jsonResponse.roles;
    if (roles.indexOf("ROLE_CLIENT") === -1) {
        throw {id: "login.roleError"};
    }
    const fbUserId = facebookResponse.userID;
    var successfulLoginAction = {
        type: LOGIN_SUCCESSFUL,
        authToken: (tokenType ? tokenType : "Bearer") + " " + accessToken,
        tokenType: (tokenType ? tokenType : "Bearer"),
        accessToken,
        refreshToken,
        roles,
        userIdentity: jsonResponse.username,
        userEmail: facebookResponse.email,
        userPicture: facebookResponse.picture.data.is_silhouette ? "" : facebookResponse.picture.data.url,
        dashboardUrl,
        fbUserId,
        isSocial: true
    };
    if (fbUserId && fbUserId !== "") {
        fetch("https://graph.facebook.com/v2.8/" + fbUserId + "/picture?height=130&redirect=false").then(res => {
            if (res.status == 200) {
                return res.json();
            } else {
                return { data: { url: successfulLoginAction.userPicture } };
            }
        }).then(json => {
            successfulLoginAction.userLoginPicture = json.data.url;
            return getUserData(dispatch, successfulLoginAction, dashboardUrl);
        }).catch(err => {
            // Ignore error but log anyway
            log("warning", "Error retrieving Facebook picture", { fbUserId, err });
            return getUserData(dispatch, successfulLoginAction, dashboardUrl);
        });
    } else {
        return getUserData(dispatch, successfulLoginAction, dashboardUrl);
    }
    return { type: "FACEBOOK_LOGIN_STAGE_2" };
};

export const loginFailed = (err) => {
    log("err", "Login failed", { err });
    return {
        type: LOGIN_FAILED,
        errorLabel: err.id
    };
};

export const startLogout = (authToken) => {
    sessionUpdate({logout: true});
    return {
        type: START_LOGOUT,
        authToken
    };
};

export const updateSessionData = (previousUsers) => {
    return {
        type: UPDATE_SESSION,
        previousUsers
    };
};

export const logoutAndUpdate = (dispatch, getState) => {
    dispatch(startLogout(getState().login.authToken));
    return sessionRetrieve(["previousUsers"]).then(json => { dispatch(updateSessionData(json.previousUsers)) }).catch(err => dispatch(updateSessionData([])));
};

export const doLogin = (dispatch, getState) => {
    var jsonBody = JSON.stringify({"username": getState().login.username, "password": getState().login.password});
    var postHeaders = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(jsonBody, 'utf8')
    };
    const shopUrl = getState().siteConfig.shopUrl;
    return fetch(API_HOST + "/api/login?url=" + shopUrl, { method: "POST", body: jsonBody, headers: postHeaders })
        .then(res => {
            if (res.status == 200) {
                return res.json();
            } else {
                throw Object.assign({}, new Error("Response returned statusCode " + res.status), { id: "login.loginError" });
            }
        })
        .then(json => {
            var tokenType = json["token_type"];
            var accessToken = json["access_token"];
            var refreshToken = json["refresh_token"];
            var userIdentity = json["username"];
            var roles = json["roles"];
            if (roles.indexOf("ROLE_CLIENT") === -1) {
                throw {id: "login.roleError"};
            } else {
                var userEmail = userIdentity;
                log("info", "Login successful", {userEmail});
                dispatch(loginSuccessful(dispatch, tokenType, accessToken, refreshToken, userIdentity, userEmail, roles, shopUrl));
            }
        })
        .catch((err) => {
            dispatch(loginFailed(err));
        });
};

export const startLoginAsync = (username, password) => {
    return function (dispatch, getState) {
        dispatch(startLogin(username, password));
        // doLogin(dispatch, getState);
        var tokenType = "Bearer";
        var accessToken = '123';
        var refreshToken = '123';
        var userIdentity = 'nnydjesus';
        const shopUrl = getState().siteConfig.shopUrl;
        var userEmail = userIdentity;
        dispatch(loginSuccessful(dispatch, tokenType, accessToken, refreshToken, userIdentity, userEmail, shopUrl));
    };
};

export const clearLogin = () => {
    return {
        type: CLEAR_LOGIN
    };
};

export const setUserData = (data) => {
    return {
        type: SET_USER_DATA,
        userData: data
    };
};
