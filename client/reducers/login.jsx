const initialEventsState = {
    username: localStorage.getItem("username"),
    inProgress: false,
    error: {},
    authToken: localStorage.getItem("authToken"),
    userLabel: undefined,
    userPicture: undefined,
    userLoginPicture: undefined,
    roles: [],
    userData: {},
    userIdentity: undefined,
    isSocial: false,
    previousUsers: [],
    showLogin: false,
    finished: false
}


const loginReducer = (state = initialEventsState, action) => {
   
    return ({
        START_LOGIN: () => {
            return {
                ...state,
                error: {},
                authToken: undefined,
                inProgress: true
            }
        },
        LOGIN_SUCCESSFUL: () => {
            localStorage.setItem("authToken", action.token)
            localStorage.setItem("username", action.username)
            return {
                ...state,
                inProgress: false,
                showLogin: false,
                authToken: action.token,
                username: action.username
            }
        },

        LOGIN_FAILED: () => {
            return {
                ...state,
                inProgress: false,
                error: {
                    label: action.error.id,
                    show: true
                }
            }
        },

        SHOW_LOGIN_MODAL: () => {
            return {
                ...state,
                showLogin: true
            }
        },

        HIDE_LOGIN_MODAL: () => {
            return {
                ...state,
                showLogin: false
            }
        },

        LOGOUT: () => {
            localStorage.removeItem("authToken")
            localStorage.removeItem("username")
            return {
                ...state,
                username: undefined,
                authToken: undefined
            }
        },
        
    
    }[action.type] || (() => state))();
};

export default loginReducer;