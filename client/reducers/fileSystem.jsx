import {Project} from '../components/ide/model.js'

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
    
    }[action.type] || (() => state))();
};

export default fsReducer;