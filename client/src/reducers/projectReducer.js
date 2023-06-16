import {
    ALL_PROJECT_REQUEST,
    ALL_PROJECT_SUCCESS,
    ALL_PROJECT_FAIL,

    SINGLE_PROJECT_REQUEST,
    SINGLE_PROJECT_SUCCESS,
    SINGLE_PROJECT_FAIL,

    CLEAR_ERRORS
} from '../constants/projectConstants' 


// get project reducer
export const projectReducer = (state = {projects: [] }, action) =>{

    switch(action.type){
        case ALL_PROJECT_REQUEST:
            return{
                loading: true,
                projects: []
            }

        case  ALL_PROJECT_SUCCESS:
            return{
                loading: false,
                projects: action.payload.projects,
            }


        case  ALL_PROJECT_FAIL:
            return{
                loading: false,
                error: action.payload
            }

        case  CLEAR_ERRORS:
            return{
                ...state,
                error: null,
            }

        default:
            return state
        
    }

}


export const projectDetailReducer = (state = {projectDetail: {} }, action) =>{

    switch(action.type){
        case SINGLE_PROJECT_REQUEST:
            return{
                loading: true,
                ...state
            }

        case  SINGLE_PROJECT_SUCCESS:
            return{
                loading: false,
                projectDetail: action.payload,
            }


        case  SINGLE_PROJECT_FAIL:
            return{
                loading: false,
                error: action.payload,
            }

        case  CLEAR_ERRORS:
            return{
                ...state,
                error: null,
            }

        default:
            return state
        
    }

}