export const createFolder = (folder) => {
    return (dispatch, getState) => {
        dispatch({ type: 'CREATE_FOLDER_SUCCESSFUL' });
    }
}

export const updateFile = (file) => {
    return (dispatch, getState) => {
        if(file.isNew){
            file.name = file.name + "."+file.extension
            dispatch({ type: 'CREATE_FILE_SUCCESSFUL', properties:file});
        }
    }
}

export const loadProject = (name) => {
    return (dispatch, getState) => {
        var project = getState().fs.projects.find(p => p.name == name)
        dispatch({ type: 'LOAD_PROJECT_SUCCESSFUL', project: project });
    }
}

export const loadProjects = () => {
    return (dispatch, getState) => {
        dispatch({ type: 'LOAD_PROJECTS_SUCCESSFUL', projects: getState().fs.projects|| [ ] });
    }
}

export const createProject = (projectName) => {
    return (dispatch, getState) => {
        dispatch({ type: 'LOAD_PROJECT_SUCCESSFUL', project: {name:projectName, extension:"directory", children:[], path:"/"}, isNew:true});
    }
}

export const deleteFile = (file) => {
    return (dispatch, getState) => {
        dispatch({ type: 'DELETE_FILE_SUCCESSFUL', file: file });
    }
}

export const deleteFolder = (folder) => {
    return (dispatch, getState) => {
        dispatch({ type: 'DELETE_FOLDER_SUCCESSFUL', folder: folder });
    }
}


export const selecteFileNode = (node) => {
    return (dispatch, getState) => {
        dispatch({ type: 'SELECT_FILE_NODE', node: node });
    }
}

export const renameFile = (file, newName) => {
    return (dispatch, getState) => {
        dispatch({ type: 'RENAME_FILE_SUCCESSFUL', file:file, newName:newName});
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