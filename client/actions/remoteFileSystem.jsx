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
    if(file.isNew){
        file.name = file.name + "."+file.extension
    }
    return (dispatch, getState) => {
        apiPost(getState, 'api/files', {
            body: {
                name:file.name,
                path:file.path,
                text: file.text
            }
        }).then(json => {
            if(file.isNew){
                dispatch({ type: 'CREATE_FILE_SUCCESSFUL', properties:file});
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
        apiPost(getState, 'api/projects', {
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

export const deleteFolder = (folder) => {
    return (dispatch, getState) => {
        apiDelete(getState, 'api/folders/'+folder.name, {
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
        apiPost(getState, 'api/files/rename', {
            body: {
                path:file.path,
                name:file.name,
                newName: newName
            }
        }).then(json => {
            dispatch({ type: 'RENAME_FILE_SUCCESSFUL', file:file, newName:newName});
        }).catch(error => {
            console.log(error)
        })
    }
}


export default {
    createFolder: createFolder,
    updateFile: updateFile,
    loadProject: loadProject,
    loadProjects: loadProjects,
    createProject: createProject,
    deleteFile: deleteFile,
    deleteFolder: deleteFolder,
    selecteFileNode: selecteFileNode,
    renameFile: renameFile
}