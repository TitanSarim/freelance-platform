import axios from 'axios';
import {
    ALL_PROJECT_REQUEST,
    ALL_PROJECT_SUCCESS,
    ALL_PROJECT_FAIL,

    SINGLE_PROJECT_REQUEST,
    SINGLE_PROJECT_SUCCESS,
    SINGLE_PROJECT_FAIL,

    CLEAR_ERRORS
} from '../constants/projectConstants' 


export const getProjects = () => async(dispatch) =>{


    try {
        
        dispatch({type: ALL_PROJECT_REQUEST});

        let link = `/api/v1/buyer/projects`;

        const {data} = await axios.get(link);

        dispatch({
            type: ALL_PROJECT_SUCCESS,
            payload: data,
        })

    } catch (error) {

        dispatch({
            type: ALL_PROJECT_FAIL,
            payload: error.response.data.message,
        })

    }


}


export const getProjectDetails = (slug) => async(dispatch) =>{


    try {
        
        dispatch({type: SINGLE_PROJECT_REQUEST});


        const {data} = await axios.get(`/api/v1/buyer/project/${slug}`);

        dispatch({
            type: SINGLE_PROJECT_SUCCESS,
            payload: data.projectDetail,
        })

    } catch (error) {

        dispatch({
            type: SINGLE_PROJECT_FAIL,
            payload: error.response.data.message,
        })

    }


}

// clearing errors

export const clearErrors = () => async (dispatch) => {

    dispatch({type: CLEAR_ERRORS})

}