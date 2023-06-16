import{
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAIL,

    USER_TYPE_REQUEST,
    USER_TYPE_SUCCESS,
    USER_TYPE_FAIL,

    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,

    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,

    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,

    CLEAR_ERRORS,
} from '../constants/userConstants'

import axios from 'axios'

// user login

export const login = (email, password) => async (dispatch) => {

    try {
        dispatch({type: LOGIN_REQUEST});
        
        const config = { headers: { "Content-Type": "application/json" } };

        const {data} = await axios.post(`/api/v1/userLogin`, 
            {email, password},
            config
        )

        dispatch({type: LOGIN_SUCCESS, payload: data.user});
        
    } catch (error) {
        dispatch({type: LOGIN_FAIL, payload: error.response.data.message});
    }

}

// user Register
export const register = (userData) => async (dispatch) => {

    try {
        dispatch({type: REGISTER_REQUEST});
        
        const config = { headers: { "Content-Type": "application/form-data" } };

        const {data} = await axios.post(`/api/v1/userRegister`, 
            userData,
            config
        )

        dispatch({type: REGISTER_SUCCESS, payload: data.user});
        
    } catch (error) {
        dispatch({type: REGISTER_FAIL, payload: error.response.data.message});
    }

}

// user Type
export const userType = (userData) => async (dispatch) => {

    try {
        dispatch({type: USER_TYPE_REQUEST});
        
        const config = { headers: { "Content-Type": "application/form-data" } };

        const {data} = await axios.post(`/api/v1/me/accountType`, 
            userData,
            config
        )

        dispatch({type: USER_TYPE_SUCCESS, payload: data.user});
        
    } catch (error) {
        dispatch({type: USER_TYPE_FAIL, payload: error.response.data.message});
    }

}

//user detail for header
export const userName = () => async (dispatch) => {


    try {

        dispatch({type: LOAD_USER_REQUEST});

        let link = `/api/v1/profileHeader`;
        

        const {data} = await axios.get(link);

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user,
        })
        
    } catch (error) {
        dispatch({type: LOAD_USER_FAIL, payload: error.response.data.message});
    }

}


// get logged user profile for dashboard
export const ProfileDashboard = () => async (dispatch) => {


    try {

        dispatch({type: USER_PROFILE_REQUEST});

        let link = `/api/v1/user/profile`;
        

        const {data} = await axios.get(link);

        dispatch({
            type: USER_PROFILE_SUCCESS,
            payload: data.result,
        })
        
    } catch (error) {
        dispatch({type: USER_PROFILE_FAIL, payload: error.response.data.message});
    }

}


//user detail for header
export const userLogOut = () => async (dispatch) => {

    try {


        await axios.get(`/api/v1/userLogout`);

        dispatch({
            type: LOGOUT_USER_SUCCESS,
        })
        
    } catch (error) {
        dispatch({type: LOGOUT_USER_FAIL, payload: error.response.data.message});
    }

}





// clearing errors

export const clearErrors = () => async (dispatch) => {

    dispatch({type: CLEAR_ERRORS})

}
