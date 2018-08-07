import { apiGet, apiPost, apiDelete, apiPut } from './apiService.jsx';

export const createFolder = (folder) => {
    return (dispatch, getState) => {
        apiPost(getState, 'folders', {
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
        })
    }
}

export const createFile = (file) => {
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
            console.log(error)
        })
    }
}

export const loadProject = (name) => {
    return (dispatch, getState) => {
        apiGet(getState, 'projects/'+name).then(json => {
            dispatch({ type: 'LOAD_PROJECT_SUCCESSFUL', project: json });
        }).catch(error => {
            console.log(error)
        })
    }
}

export const loadProjects = () => {
    return (dispatch, getState) => {
        apiGet(getState, 'projects').then(json => {
            dispatch({ type: 'LOAD_PROJECTS_SUCCESSFUL', projects: json.map( name=> { 
                return {name:name}
            } ) });
        }).catch(error => {
            console.log(error)
        })
    }
}

export const createProject = (projectName) => {
    return (dispatch, getState) => {
        apiPost(getState, 'projects', {
            body: {
                name:projectName
            }
        }).then(json => {
            dispatch({ type: 'LOAD_PROJECT_SUCCESSFUL', project: json, isNew:true });
        }).catch(error => {
            console.log(error)
        })
    }
}

export const deleteFile = (file) => {
    return (dispatch, getState) => {
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
        })
    }
}

export const deleteFolder = (folder) => {
    return (dispatch, getState) => {
        apiDelete(getState, 'folders/'+folder.name, {
            body: {
                path:folder.path
            }
        }).then(json => {
            dispatch({ type: 'DELETE_FOLDER_SUCCESSFUL', folder: folder });
        }).catch(error => {
            console.log(error)
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