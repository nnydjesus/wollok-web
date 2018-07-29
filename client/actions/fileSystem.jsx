import { apiGet, apiPost } from './apiService.jsx';

export const createFolder = (folder) => {
    return (dispatch, getState) => {
        apiPost(getState, 'api/folders', {
            body: {
                name:folder.name,
                path:folder.path
            }
        }).then(json => {
            console.log(json)
        }).catch(error => {
            console.log(error)
        })
    }
}

export const updateFile = (file) => {
    return (dispatch, getState) => {
        apiPost(getState, 'api/files', {
            body: {
                name:file.name,
                path:file.path,
                extension:file.extension,
                text: file.text
            }
        }).then(json => {
            console.log(json)
        }).catch(error => {
            console.log(error)
        })
    }
}

export const loadProject = (name) => {
    return (dispatch, getState) => {
        apiGet(getState, 'api/projects/'+name).then(json => {
            dispatch({ type: 'LOAD_PROJECT_SUCCESSFUL', project: json });
        }).catch(error => {
            console.log(error)
        })
    }
}

export const loadProjects = () => {
    return (dispatch, getState) => {
        apiGet(getState, 'api/projects').then(json => {
            dispatch({ type: 'LOAD_PROJECTS_SUCCESSFUL', projects: json });
        }).catch(error => {
            console.log(error)
        })
    }
}

export const createProject = (projectName) => {
    return (dispatch, getState) => {
        apiPost(getState, 'api/projects', {
            body: {
                name:projectName
            }
        }).then(json => {
            dispatch({ type: 'LOAD_PROJECT_SUCCESSFUL', project: json });
        }).catch(error => {
            console.log(error)
        })
    }
}