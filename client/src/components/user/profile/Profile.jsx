import React,{useEffect, Fragment} from 'react'
import { ProSidebarProvider } from 'react-pro-sidebar';

import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert';
import {ProfileDashboard, clearErrors} from '../../../actions/userAction'

import Loader from '../../layout/loader/Loader'
import DashboardNav from '../dashboard/DashboardNav'

const Profile = () => {

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
          <p>Profile</p>
        </div>

      </div>

    </Fragment>
    
  </ProSidebarProvider>
  )
}

export default Profile