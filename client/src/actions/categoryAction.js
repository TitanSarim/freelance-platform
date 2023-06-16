import axios from 'axios';
import {
    ALL_CATEGORY_REQUEST,
    ALL_CATEGORY_SUCCESS,
    ALL_CATEGORY_FAIL,
    CLEAR_ERRORS
} from '../constants/categoryConstants' 


export const getCategories = () => async(dispatch) =>{


    try {
        
        dispatch({type: ALL_CATEGORY_REQUEST});

        let link = `/api/v1/categories`;

        const {data} = await axios.get(link);

        dispatch({
            type: ALL_CATEGORY_SUCCESS,
            payload: data,
        })

    } catch (error) {

        dispatch({
            type: ALL_CATEGORY_FAIL,
            payload: error.response.data.message,
        })

    }


}


// clearing errors

export const clearErrors = () => async (dispatch) => {

    dispatch({type: CLEAR_ERRORS})

}