import { apiGet, apiPost, apiDelete } from './apiService.jsx';

export const createFolder = (folder) => {
    return (dispatch, getState) => {
        apiPost(getState, 'api/folders', {
            body: {
                name:folder.name,
                path:folder.path
            }
        }).then(json => {
            dispatch({ type: 'CREATE_FOLDER_SUCCESSFUL' });
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
            if(file.isNew){
                dispatch({ type: 'CREATE_FILE_SUCCESSFUL', file:file});
            }
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

export const deleteFile = (file) => {
    return (dispatch, getState) => {
        apiDelete(getState, 'api/files/'+file.name, {
            body: {
                path:file.path
            }
        }).then(json => {
            dispatch({ type: 'DELETE_FILE_SUCCESSFUL', file: file });
        }).catch(error => {
            console.log(error)
        })
    }
}