import React, {useEffect, Fragment } from 'react'
import {Link} from 'react-router-dom'
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar} from 'react-pro-sidebar';
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert';
import {ProfileDashboard, clearErrors} from '../../../actions/userAction'


import Loader from '../../layout/loader/Loader'

import {IoIosArrowForward} from 'react-icons/io'
import {HiMenuAlt2} from 'react-icons/hi'
import {BiUser, BiHomeAlt} from 'react-icons/bi'

import './DashboardNav.css'





const DashboardNav = () => {

  const {collapseSidebar, collapsed } = useProSidebar();

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

  <Fragment>
  {loading ? <Loader/> : (
    <div className='sidebar__container'>

        <Sidebar>
        
          <div className='sidebar__header' style={{marginBottom: collapsed ? '0px' : '10px'}}>
            {result && result.profileImage && result.profileImage.link ? (
              <img src={result.profileImage.link} alt={result.username} style={{ width: collapsed ? '50px' : '100px', height: collapsed ? '50px' : '100px', }}/>
              ):(
                <div className='sidebar__user__name__img'>
                {result && result.username &&
                  <p>{result.username[0]}</p>
                }
                </div>
              )
            }
            {result && result.username &&
              <p style={{fontSize: collapsed ? '0px' : '20px'}}>{result.username}</p>
            }
            {/* {result && result.quote &&
              <p style={{fontSize: collapsed ? '0px' : '14px'}} className='dashboard__quote'>{result.quote}</p>
            } */}
          </div>

          <div className='dashboard__nav__divider' style={{ marginBottom: collapsed ? '0px' : '20px'}}>
            <hr/>
          </div>

          <div style={{ padding: '0 24px', marginBottom: '8px' }}>
              <p style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px', fontSize: '15px' ,fontWeight: 500, color: 'rgb(150, 150, 150)' }}>
                General
              </p>
          </div>
          <Menu>

            <MenuItem label="Home" component={<Link to="/DashboardHome"/>} icon={<BiHomeAlt size={24}/>}>Home</MenuItem>
            
            <MenuItem label="Home" component={<Link to="/Profile"/>} icon={<BiUser size={24}/>}>Profile</MenuItem>


            <SubMenu label="Charts">
              <MenuItem component={<Link to="/" />}> Pie charts </MenuItem>
              <MenuItem> Line charts </MenuItem>
            </SubMenu>  

            <SubMenu label="Charts">
              <MenuItem component={<Link to="/" />}> Pie charts </MenuItem>
              <MenuItem> Line charts </MenuItem>
            </SubMenu>  
            <MenuItem > Documentation</MenuItem>
    
          </Menu>

        </Sidebar>

        <main>
          <button onClick={() => collapseSidebar ()} >
            {collapsed ? <IoIosArrowForward size={27} className='menu__close'/> : <HiMenuAlt2 size={32} className='menu__open'/>}
          </button>
        </main>

    </div>
  )}
  </Fragment>


  )
}

export default DashboardNav