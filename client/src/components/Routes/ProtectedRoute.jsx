import React from 'react'
import { useSelector } from 'react-redux'
import {Outlet, Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = () => {

    const {isAuthenticated} = useSelector((state)=>state.user)
    const location = useLocation();

    if(!isAuthenticated){
      localStorage.setItem('prevLocation', JSON.stringify(location.pathname));
    }

  return (
    
    isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
    
  )
}

export default ProtectedRoute