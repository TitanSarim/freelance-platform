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



export const userReducer = (state = {user: []}, action) =>{



    switch(action.type){

        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
        case USER_TYPE_REQUEST:
        case LOAD_USER_REQUEST:
            return{
                loading: true,
                isAuthenticated: false,
            }

        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
        case USER_TYPE_SUCCESS:
        case LOAD_USER_SUCCESS:
            return{
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
            }

        case LOGOUT_USER_SUCCESS:
            return{
                loading: false,
                user: null,
                isAuthenticated: false
            }
    

       
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case USER_TYPE_FAIL:
            return{
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload,
            };

        case LOAD_USER_FAIL:
            return{
                loading: false,
                isAuthenticated: false,
                error: action.payload,
            };

        case LOGOUT_USER_FAIL:
            return{
                ...state,
                loading: false,
                error: action.payload
            }
 
        

        case  CLEAR_ERRORS:
            return{
                ...state,
                error: null,
            }

        default:
            return state;    
    }



}

// user profile for dashboard
export const ProfileDashboardReducer = (state = {result: []}, action) =>{

    switch(action.type){
        case USER_PROFILE_REQUEST:
            return{
                loading: true,
                isAuthenticated: false,
            }

        case  USER_PROFILE_SUCCESS:
            return{
                ...state,
                loading: false,
                isAuthenticated: true,
                result: action.payload,
            }


        case  USER_PROFILE_FAIL:
            return{
                loading: false,
                isAuthenticated: false,
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
