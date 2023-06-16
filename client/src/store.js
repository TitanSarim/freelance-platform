import { configureStore } from '@reduxjs/toolkit';
import {combineReducers } from "redux"
import thunk from "redux-thunk"

import {categoryReducer} from './reducers/categoryReducer'
import { projectReducer, projectDetailReducer } from './reducers/projectReducer';

import {userReducer, ProfileDashboardReducer} from './reducers/userReducer'








const reducer = combineReducers({


    // category
    categories: categoryReducer,
    
    projects: projectReducer,  

    projectDetail: projectDetailReducer,
    
    //user
    user: userReducer,

    // Dashboard profile
    result: ProfileDashboardReducer

});


const middleware = [thunk]

const store = configureStore({

    reducer,

    middleware,

    devTools: process.env.NODE_ENV !== 'production',


})

export default store;