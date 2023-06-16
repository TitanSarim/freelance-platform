import React, { useEffect, Fragment, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProjectDetails, clearErrors } from '../../actions/projectAction';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData'
import Loader from '../layout/loader/Loader';
import { RatingStar } from "rating-star";
import { HiOutlineSearch } from "react-icons/hi";
import {CiShare1} from 'react-icons/ci'
import {TbFileInvoice} from 'react-icons/tb'
import {BsHeartFill, BsHeart} from 'react-icons/bs'

import ImageDesc from './ImageDesc';

import './ProjectDetail.css'
import ProjectPackages from './ProjectPackages';


const ProjectDetail = ({ match, toggleDialogue, isOpen}) => {


  const dispatch = useDispatch();
  const alert = useAlert();

  const {slug} = useParams();

  const {projectDetail, error, loading } = useSelector((state) => state.projectDetail);

  const [copySuccess, setCopySuccess] = useState('');

  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert.success('Copied!');
  };


  useEffect(() => {

    if(error){

        alert.error(error)
            dispatch(clearErrors());
        }

        if (slug) {
            dispatch(getProjectDetails(slug));
          }

      
  }, [dispatch, error, alert, slug]);

  return (

    <>
      {loading ? <Loader/> : (
        
      <Fragment>

        <MetaData title={`${projectDetail.heading}`}/>

        <div className="project__detial__container">

            {/* header starts */}
            <div className={`project__detial__header__section ${isOpen ? 'blur' : ''}`}>

              <div className='project__detial__header__first'>

                  <div className='project__detial__header__first__search'>
                    <input placeholder='Search . . .'/>
                    <button className='project__detial__header__search_button'>
                      <HiOutlineSearch size={25}/>
                    </button>
                  </div>

                  <div className='project__detial__header__first__share'>
                    <p>
                      <button onClick={copyToClipboard}><CiShare1 size={20}/></button>
                      Share
                    </p>
                    <p>
                      <button><BsHeart size={18}/></button>
                      Save
                    </p>
                  </div>

              </div>

              <div className='project__detial__header__second'>

                  <div className='project__detial__header__second__title'>
                    <p>{projectDetail.heading}</p>
                  </div>

                <div className='project__detial__header__second__user__detail'>
                  <div className='project__detial__header__second__user'>
                    {projectDetail && projectDetail.profilephoto && (
                      <img src={projectDetail.profilephoto.link} alt={projectDetail.username}/>
                    )}
                    <p>{projectDetail.username}</p>
                  </div>

                  <div className='project__detial__header__second__reviews'>
                    <span>
                    <RatingStar colors={{ mask: "#F7DC6F" }} rating={projectDetail.reviews}  numberOfStar={1} size={20} id={projectDetail.slug}/>
                    </span>
                    <p>{projectDetail.reviews > 0 ? projectDetail.reviews : 0} <span>( Rating )</span></p>
                  </div>

                  <div className='project__detial__header__second__orders'>
                    <TbFileInvoice size={22}/>
                    <p>{projectDetail.orders > 0 ? projectDetail.orders : 0} <span>( Orders )</span></p>
                  </div>

                </div>

              </div>

            </div>
            {/* header ends */}

            <div className='project__detial__body__section'>

              <div className={`project__detial__body__imgdesc ${isOpen ? 'blur' : ''}`}>
                <ImageDesc projectDetail={projectDetail}/>
              </div>

              <div className='project__detial__body__packages'>
                <ProjectPackages packages={projectDetail} toggleDialogue={toggleDialogue} isOpen={isOpen}/>
              </div>

            </div>
          
        </div>
      </Fragment>
      
      )}
    </>
  );
};

export default ProjectDetail;
