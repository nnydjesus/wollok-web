import {Project} from '../components/ide/model.js'
import _ from 'lodash';

const initialEventsState = {
    project: undefined,
    projects: []
}


const fsReducer = (state = initialEventsState, action) => {
    
    let updateState = (object = {}) => {
        return {
            ...state,
            ...object
        };
    };

   
    return ({
        
        LOAD_PROJECT_SUCCESSFUL: () => {
            action.project.updates = 0
            return {
                ...state,
                project: new Project(action.project)
            };
        },

        LOAD_PROJECTS_SUCCESSFUL: () => {
            return {
                ...state,
                projects: action.projects
            };
        },
        DELETE_FILE_SUCCESSFUL: () =>{
            var folder = state.project.findFolderByPath(action.file.path)
            _.remove(folder.children, c => c.name == action.file.name)
            return {
                project:{
                    ...state.project,
                    updates: state.project.updates+1
                }
            }
        },

        CREATE_FILE_SUCCESSFUL: () => {
            action.file.isNew = false
            return {
                project:{
                    ...state.project,
                    updates: state.project.updates+1
                }
            }
        },

        CREATE_FOLDER_SUCCESSFUL: () => {
            return {
                project:{
                    ...state.project,
                    updates: state.project.updates+1
                }
            }
        },
    
    }[action.type] || (() => state))();
};

export default fsReducer;