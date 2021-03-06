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
                saveCompeteProject(dispatch, getState, getState().fs.project.toJson())
            }
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'LOGIN_FAILED', error:error.id });
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
                saveCompeteProject(dispatch, getState, getState().fs.project.toJson())
            }
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'LOGIN_FAILED', error:error });
        })
    }
}
export const facebookLogin = (facebookResponse) => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_LOGIN'});
        apiPost(getState, 'auth/facebook', {
            body: {
                access_token:facebookResponse.token.accessToken
            }
        }).then(json => {
            dispatch({ type: 'LOGIN_SUCCESSFUL', token:json.token, username: json.name });
            if(getState().fs.project){
                saveCompeteProject(dispatch, getState, getState().fs.project.toJson())
            }
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'LOGIN_FAILED', error:error.id });
        })
    }
}

export const googleLogin = (googleResponse) => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_LOGIN'});
        apiPost(getState, 'auth/google', {
            body: {
                access_token:googleResponse.token.accessToken
            }
        }).then(json => {
            dispatch({ type: 'LOGIN_SUCCESSFUL', token:json.token, username: json.name });
            if(getState().fs.project){
                saveCompeteProject(dispatch, getState, getState().fs.project.toJson())
            }
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'LOGIN_FAILED', error:error.id });
        })
    }
}

export const githubLogin = (code) => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_LOGIN'});
        apiGet(getState, 'auth/github/authenticate', {
            params:{
                code:code
            }
        }).then(json => {
            history.pushState({}, null, "/");
            dispatch({ type: 'LOGIN_SUCCESSFUL', token:json.token, username: json.name });
            if(localStorage.hasOwnProperty("project")){
                var project = JSON.parse(localStorage.getItem("project"))
                localStorage.removeItem("project")
                saveCompeteProject(dispatch, getState, project)
            }
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'LOGIN_FAILED', error:error.id });
        })
    }
}

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

export const saveCompeteProject = (dispatch, getState, jsonProject) => {
    dispatch({ type: 'START_SAVE_COMPLETE_PROJECT' });
    apiPost(getState, 'projects/complete', {
        body: jsonProject
    }).then(json => {
        dispatch({ type: 'SAVE_COMPLETE_PROJECT_SUCCESSFUL', project:json });
    }).catch(error => {
        console.log(error)
        dispatch({ type: 'COMPLETE_PROJECT_FAILED', error:error });
    })
}
