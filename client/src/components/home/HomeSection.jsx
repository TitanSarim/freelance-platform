import React from 'react'
import NeedCard from './NeedCard'
import Categories from './Categories'
import hero_img from '../../assets/hero_image.svg'
import { HiOutlineSearch } from "react-icons/hi";
import {BsArrowRightShort} from "react-icons/bs"


import './home.css'
import Projects from './Projects';

const HomeSection = () => {
  return (
    
    <div className='home-container'>

      <div className='home__section'>


        <div className='home__content'>

          <div className='home_heading__1'>
            <p>Hire The Best Team To Make Your Dream True</p>
            <span>Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious.</span>
          </div>
          
          <div className='home__search__box'>
            <input placeholder='Search . . .'/>
            <button className='home__search_button'>
              <HiOutlineSearch size={25}/>
            </button>
          </div>

          <div className='home__navigation__button'>
            <button className='home_getstarted_btn'>
              Get Started
              <span><BsArrowRightShort size={25}/></span>
            </button>
          </div>
     
        </div>

        <div className='home__image'>
          <img src={hero_img} alt='hero imag'/>
        </div>

      </div>
   
      <NeedCard/>

      <Categories/>
      
      <Projects/>


    </div>
  
  )
}

export default HomeSection