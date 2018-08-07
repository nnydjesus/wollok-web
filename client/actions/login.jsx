import { apiGet, apiPost, apiDelete } from './apiService.jsx';

export const startLogin = (email, password) => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_LOGIN'});
        apiPost(getState, 'auth/signin', {
            body: {
                email:email,
                password:password,
            }
        }).then(json => {
            dispatch({ type: 'LOGIN_SUCCESSFUL', token:json.token, username: json.name });
            if(getState().fs.project){
                saveCompeteProject(dispatch, getState)
            }
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'LOGIN_FAILED', error:error });
        })
    }
}


export const startRegistration = (email, password, name) => { 
    return (dispatch, getState) => {
        dispatch({ type: 'START_LOGIN'});
        apiPost(getState, 'auth/signup', {
            body: {
                email:email,
                password:password,
                name:name
            }
        }).then(json => {
            dispatch({ type: 'LOGIN_SUCCESSFUL', token:json.token, username:json.name });
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
    apiPost(getState, 'projects/complete', {
        body: getState().fs.project.toJson()
    }).then(json => {
        dispatch({ type: 'SAVE_COMPLETE_PROJECT_SUCCESSFUL', project:json });
    }).catch(error => {
        console.log(error)
    })
}