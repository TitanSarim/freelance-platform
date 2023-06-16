import React,{useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux';
import { getProjects, clearErrors } from '../../actions/projectAction';
import {useAlert} from 'react-alert'
import Slider from "react-slick";
import { RatingStar } from "rating-star";
import {Tabs, TabsHeader, Tab, TabPanel} from "@material-tailwind/react";
import Loader from '../layout/loader/Loader';

import './Projects.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Projects = () => {
  
    const categories = [
      {
        label: "app developer",
        category: "app developer",
      },
      {
        label: "web developement",
        category: "web developement",
      },
      {
        label: "wordpress",
        category:"wordpress"
      }
    ]

    const dispatch = useDispatch();
    const alert = useAlert(); 

    const {projects, error, loading} = useSelector(state=>state.projects);
    const [selectedCategory, setSelectedCategory] = useState(categories[0].category);

    const filteredProjects = selectedCategory ? projects.filter(project => project.category.includes(selectedCategory)) : projects;

    useEffect(() =>{

        if(error){
          alert.error(error)
          dispatch(clearErrors());
        }

        dispatch(getProjects());

    }, [alert, dispatch, error])


    var settings = {
      dots: false,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

  return (
    
    <>

      {loading ? <Loader/> :(

      <div className='home__project__container'>

        <div className='home__project__container__header'>
          <p>Popular Services</p>
        </div>  
      
      
        <Tabs value={selectedCategory} className="w-[100%]">

        <div className='home__project__container__services__tabs'>
          <p>Our most viewed and top selling services</p>

          <TabsHeader 
            className="home__project__container__services__tab__list w-[32rem] "
            indicatorProps={{
              className: "font-bold shadow-md bg-white-50 border-[1px] border-gray-200 rounded-lg",
            }}
          >
            {categories.map(({label, category}) => (
              <Tab className='home__project__container__services__tab__selected' key={label} value={category} onClick={() => {console.log('Tab clicked'); setSelectedCategory(category)}}>
                <p>{category}</p>
              </Tab>
            ))}
          </TabsHeader>

        </div>

          <div className='home__project__section'>

              {filteredProjects.map((project) =>(

                <TabPanel key={project.id} value={selectedCategory} className='max-w-fit p-0'>
                
                <div key={project.id} className='home__project__mapping'>

                  <div className='home__project__mapping__images'>
                    <Slider {...settings}>                  
                      {project.images && project.images.map((image) => (
                        <img src={image.link} alt={project.heading} className='home__project__mapping__image' key={project.id}/>
                      ))}
                    </Slider>
                  </div>

                  <div className='home__project__mapping__content'>

                    <div className='home__project__mapping__content__category'>
                      {JSON.parse(project.category)}
                    </div>
                    
                    <div className='home__project__mapping__content__heading'>
                      <Link to={`/project/${project.slug}`}>
                        <p>{project.heading}</p>
                      </Link>
                    </div>


                    {project.reviews && project.orders ? (
                      <div className='home__project__mapping__reviews'>
                        <span className='home__project__mapping__reviews__span'>
                          <RatingStar rating={project.reviews}  numberOfStar={1} size={20}/>
                          <p>{project.reviews}</p>
                        </span>
                        <h6>Orders ({project.orders})</h6>
                      </div>
                    ):(
                      <span className='home__project__mapping__no__reviews'>No reviews</span>
                    )}


                    <div className='home__project__mapping__content__user'>
                      <div className='home__project__mapping__content__user__name_img'>
                        <img src={project.profilephoto.link} alt={project.heading} key={project.id}/>
                        <p>{project.username}</p>
                      </div>
                      <div className='home__project__mapping__content__user__span'>
                        <span>Starting at:</span>
                        <p key={project.id}>${project.types[0].price}</p>
                      </div>
                    </div>

                  </div>


                </div>

                </TabPanel>
                

              ))}

          </div>

        </Tabs>


      </div>

      )}

    </>
  
  )
}

export default Projects