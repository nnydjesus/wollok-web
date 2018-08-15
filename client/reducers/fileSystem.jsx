import {Project, File} from '../model/model.js'
import _ from 'lodash';

const initialEventsState = {
    project: undefined,
    selectedNode: undefined,
    updates: 0,
    loading: false,
    projects: [],
    loadgingSaveCompleteProject: false
}


const fsReducer = (state = initialEventsState, action) => {
   
    return ({
        START_LOAD_PROJECT: () => {
            return{
                ...state,
                loading: true
            }
        },
        
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
                loading: false,
                projects: action.isNew?[...state.projects, project]:state.projects,
                selectedNode: project
            };
        },

        LOAD_PROJECT_FAILED: () => {
            return{
                ...state,
                loading: false
            }
        },

        SAVE_COMPLETE_PROJECT_SUCCESSFUL: () => {
            var project = project = new Project(action.project)
            project.compile()
            return {
                ...state,
                loading: false,
                updates: 0,
                project: project,
                projects: [project],
                selectedNode: project.find(state.selectedNode)
            };
        },

        START_LOAD_PROJECTS: () => {
            return{
                ...state,
                loading: true
            }
        },

        LOAD_PROJECTS_SUCCESSFUL: () => {
            return {
                ...state,
                projects: action.projects, 
                updates: state.updates + 1,
                loading: false,
            };
        },

        LOAD_PROJECTS_FAILED: () => {
            return{
                ...state,
                loading: false
            }
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
                loading: true
            }
        },

        START_SAVE_COMPLETE_SUCCESSFUL: () => {
            return {
                ...state,
                false: false
            }
        },

        SAVE_COMPLETE_FAILED: () => {
            return {
                ...state,
                false: false
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