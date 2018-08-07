import { apiGet, apiPost, apiDelete, apiPut } from './apiService.jsx';

export const createFolder = (folder) => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_CREATE_FOLDER' });
        apiPost(getState, 'folders', {
            body: {
                name:folder.name,
                path:folder.path
            }
        }).then(json => {
            dispatch({ type: 'CREATE_FOLDER_SUCCESSFUL' });
        }).catch(error => {
            dispatch({ type: 'CREATE_FOLDER_FAILED', error });
            console.log(error)
        })
    }
}

export const updateFile = (file) => {
    dispatch({ type: 'START_UPDATE_FILE' });
    return (dispatch, getState) => {
        apiPut(getState, 'files', {
            body: {
                name:file.name,
                path:file.path,
                sha:file.sha,
                text: file.text
            }
        }).then(json => {
            dispatch({ type: 'UPDATE_FILE_SUCCESSFUL', file, sha:json.sha});
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'UPDATE_FILE_FAILED', error });
        })
    }
}

export const createFile = (file) => {
    dispatch({ type: 'START_CREATE_FILE' });
    file.name = file.name + "."+file.extension
    return (dispatch, getState) => {
        apiPost(getState, 'files', {
            body: {
                name:file.name,
                path:file.path,
                text: file.text
            }
        }).then(json => {
            dispatch({ type: 'CREATE_FILE_SUCCESSFUL', properties:file, sha:json.sha});
        }).catch(error => {
            dispatch({ type: 'CREATE_FILE_FAILED', error });
            console.log(error)
        })
    }
}

export const loadProject = (name) => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_LOAD_PROJECT' });
        apiGet(getState, 'projects/'+name).then(json => {
            dispatch({ type: 'LOAD_PROJECT_SUCCESSFUL', project: json });
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'LOAD_PROJECT_FAILED', error });
        })
    }
}

export const loadProjects = () => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_LOAD_PROJECTS' });
        apiGet(getState, 'projects').then(json => {
            dispatch({ type: 'LOAD_PROJECTS_SUCCESSFUL', projects: json.map( name=> { 
                return {name:name}
            } ) });
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'LOAD_PROJECTS_FAILED', error });
        })
    }
}

export const createProject = (projectName) => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_CREATE_PROJECT' });
        apiPost(getState, 'projects', {
            body: {
                name:projectName
            }
        }).then(json => {
            dispatch({ type: 'CRATE_PROJECT_SUCCESSFUL', project: json, isNew:true });
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'CREATE_PROJECT_FAILED', error });
        })
    }
}

export const deleteFile = (file) => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_DELETE_FILE' });
        apiDelete(getState, 'files/'+file.name, {
            body: {
                path:file.path,
                name:file.name,
                sha: file.sha,
            }
        }).then(json => {
            dispatch({ type: 'DELETE_FILE_SUCCESSFUL', file: file });
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'DELETE_FILE_FAILED', error });
        })
    }
}

export const deleteFolder = (folder) => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_DELETE_FOLDER' });
        apiDelete(getState, 'folders/'+folder.name, {
            body: {
                path:folder.path
            }
        }).then(json => {
            dispatch({ type: 'DELETE_FOLDER_SUCCESSFUL', folder: folder });
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'DELETE_FOLDER_FAILED', error });
        })
    }
}


export const selecteFileNode = (node) => {
    return (dispatch, getState) => {
        dispatch({ type: 'SELECT_FILE_NODE', node: node });
    }
}

export const renameFile = (file, newName) => {
    return (dispatch, getState) => {
        dispatch({ type: 'START_RENAME_FILE' });
        apiPost(getState, 'files/rename', {
            body: {
                path:file.path,
                name:file.name,
                sha: file.sha,
                newName: newName
            }
        }).then(json => {
            dispatch({ type: 'RENAME_FILE_SUCCESSFUL', file:file, newName:newName, sha:json.sha});
        }).catch(error => {
            console.log(error)
            dispatch({ type: 'RENAME_FILE_FAILED', error });
        })
    }
}


export default {
    createFolder: createFolder,
    updateFile: updateFile,
    createFile: createFile,
    loadProject: loadProject,
    loadProjects: loadProjects,
    createProject: createProject,
    deleteFile: deleteFile,
    deleteFolder: deleteFolder,
    selecteFileNode: selecteFileNode,
    renameFile: renameFile
}