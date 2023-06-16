import React,{useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import { getCategories, clearErrors } from '../../actions/categoryAction';
import {useAlert} from 'react-alert'
import DialogBox from './DialogBox'

import "./category.css"



const Categories = () => {


  const dispatch = useDispatch();
  const alert = useAlert(); 

  const {categories, error} = useSelector(state=>state.categories)

  useEffect(() =>{

    if(error){
      alert.error(error)
      dispatch(clearErrors());
    }

    dispatch(getCategories());

  }, [alert, dispatch, error])

  // show all



  return (

    <div className='home__categories'>

      <div className='home__categories__heading'>
        <p>Categories</p>
        <span>Select the related Category</span>
      </div>

      <div className='home__category__container'>

        {categories && categories.slice(0, 4).map((category) => (

            <div key={category.id} className='home__category__section'>
              <span>{category.category}</span>
              <p>{category.description}</p>
            </div>
          
        ))}
        
      </div>


      <DialogBox categories={categories}/>

        

    </div>


  )
}

export default Categories