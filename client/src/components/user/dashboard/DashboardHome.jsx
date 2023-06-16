import React, { Fragment, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert';
import {ProfileDashboard, clearErrors} from '../../../actions/userAction'
import { ProSidebarProvider } from 'react-pro-sidebar';

import Loader from '../../layout/loader/Loader'
import DashboardNav from './DashboardNav'

import './DashboardHome.css'

const DashboardHome = () => {

  const dispatch = useDispatch();
  const alert = useAlert();

  const {result, error, loading} = useSelector((state)=>state.result);

  useEffect(() =>{

    if(error){
      alert.error(error)
      dispatch(clearErrors());
    }

    dispatch(ProfileDashboard());

}, [alert, dispatch, error])


  return (
    
      <ProSidebarProvider>
        <Fragment>

          <div className='dashboard__home__container'>

            <div>
              <DashboardNav/>
            </div>


            <div>

            </div>

          </div>

        </Fragment>
        
      </ProSidebarProvider>
    
    
  )
}

export default DashboardHome