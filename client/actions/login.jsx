import { apiGet, apiPost, apiDelete } from './apiService.jsx';

export const startLogin = (username, password) => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_LOGIN'});
        apiPost(getState, 'auth/login', {
            body: {
                username:username,
                password:password
            }
        }).then(json => {
            dispatch({ type: 'LOGIN_SUCCESSFUL', token:json.token, username:username });
            if(getState().fs.project){
                saveCompeteProject(dispatch, getState)
            }
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'LOGIN_FAILED', error:error });
        })
    }
}


export const startRegistration = (username, password) => { 
    return (dispatch, getState) => {
        dispatch({ type: 'START_LOGIN'});
        apiPost(getState, 'auth/register', {
            body: {
                username:username,
                password:password
            }
        }).then(json => {
            dispatch({ type: 'LOGIN_SUCCESSFUL', token:json.token, username:username });
            if(getState().fs.project){
                saveCompeteProject(dispatch, getState)
            }
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'LOGIN_FAILED', error:error });
        })
    }
}
export const facebookLoginSuccessfulAsync = { }

export const loginFailed = { }

export const forgotPassword = { }

export const clearForgotPassword = { }

export const showLogin = () => {
    return (dispatch, getState) => {
        dispatch({ type: 'SHOW_LOGIN_MODAL'});
    }
}

export const logout = () => {
    return (dispatch, getState) => {
        dispatch({ type: 'LOGOUT'});
    }
}

export const hideLogin = () => {
    return (dispatch, getState) => {
        dispatch({ type: 'HIDE_LOGIN_MODAL'});
    }
}

export const saveCompeteProject = (dispatch, getState) => {
    dispatch({ type: 'START_SAVE_COMPLETE_PROJECT' });
    apiPost(getState, 'api/projects/complete', {
        body: getState().fs.project
    }).then(json => {
        dispatch({ type: 'SAVE_COMPLETE_PROJECT_SUCCESSFUL' });
    }).catch(error => {
        console.log(error)
    })
}