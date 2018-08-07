import {Project, File} from '../model/model.js'
import _ from 'lodash';

const initialEventsState = {
    project: undefined,
    selectedNode: undefined,
    updates: 0,
    projects: [],
    loadgingSaveCompleteProject: false
}


const fsReducer = (state = initialEventsState, action) => {
   
    return ({
        
        LOAD_PROJECT_SUCCESSFUL: () => {
            action.project.updates = 0
            var project
            if(action.project.isProject === true ){
                project = action.project
            }else{
                project = new Project(action.project)
            }
            project.compile()
            return {
                ...state,
                updates: 0,
                project: project,
                projects: action.isNew?[...state.projects, project]:state.projects,
                selectedNode: project
            };
        },

        SAVE_COMPLETE_PROJECT_SUCCESSFUL: () => {
            var project = project = new Project(action.project)
            project.compile()
            return {
                ...state,
                updates: 0,
                project: project,
                projects: [project],
                selectedNode: project.find(state.selectedNode)
            };
        },

        LOAD_PROJECTS_SUCCESSFUL: () => {
            return {
                ...state,
                projects: action.projects, 
                updates: state.updates + 1
            };
        },
        DELETE_FILE_SUCCESSFUL: () =>{
            var folder = state.project.findFolderByPath(action.file.path)
            _.remove(folder.children, c => c.name == action.file.name)
            return {
                ...state, 
                updates: state.updates + 1
            }
        },

        DELETE_FOLDER_SUCCESSFUL: () =>{
            var folder = state.project.findFolderByPath(action.folder.path)
            _.remove(folder.children, c => c.name == action.folder.name)
            return {
                ...state, 
                updates: state.updates + 1
            }
        },

        CREATE_FILE_SUCCESSFUL: () => {
            action.properties.isNew = false
            action.properties.sha = action.sha
            var file = new File(action.properties)
            state.project.addFile(file)
            return {
                ...state, 
                updates: state.updates + 1
            }
        },

        UPDATE_FILE_SUCCESSFUL: () => {
            action.file.sha = action.sha
            return {
                ...state, 
                updates: state.updates + 1
            }
        },

        CREATE_FOLDER_SUCCESSFUL: () => {
            return {
                ...state, 
                updates: state.updates + 1
            }
        },

        SELECT_FILE_NODE: () => {
            return {
                ...state,
                selectedNode: state.project.find(action.node)
            }
        },

        RENAME_FILE_SUCCESSFUL: () => {
            action.file.name =  action.file.rename
            return {
                ...state,
                updates: state.updates + 1
            }
        },
        START_SAVE_COMPLETE_PROJECT: () => {
            return {
                ...state,
                loadgingSaveCompleteProject: true
            }
        },

        START_SAVE_COMPLETE_SUCCESSFUL: () => {
            return {
                ...state,
                loadgingSaveCompleteProject: false
            }
        },

        LOGOUT: () => {
            return {
                ...state,
                project: undefined,
                selectedNode: undefined,
                projects: []
            }
        },
        
    
    }[action.type] || (() => state))();
};

export default fsReducer;