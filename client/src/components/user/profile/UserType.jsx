import React,{useState, useEffect, Fragment} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Loader from '../../layout/loader/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {clearErrors, userType} from '../../../actions/userAction'
import {useAlert} from 'react-alert';

import { Radio } from "@material-tailwind/react";
import userTypeImg from '../../../assets/backgrounds/userType.svg';
import costumer from '../../../assets/icon/costumer.png';
import crossSelling from '../../../assets/icon/cross-selling.png';




import './UserType.css'


const UserType = () => {


  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const {error, loading, isAuthenticated} = useSelector((state)=>state.user);

  const [user, setUser] = useState({
      seller: "seller",
      buyer: "buyer",
  })

  const handleChange = (event) => {
    const { name } = event.target;
    setUser((prevState) => ({
      ...prevState,
      seller: name === 'seller' ? !prevState.seller : prevState.seller,
      buyer: name === 'buyer' ? !prevState.buyer : prevState.buyer,
    }));
  };

  const {seller, buyer} = user

  const typeSubmit = (e) =>{
    e.preventDefault();

    const myForm = new FormData();

    if(user.buyer){
      myForm.set("accounttype", "buyer");
    }else if(user.seller){
      myForm.set("accounttype", "seller");
    }
    
    dispatch(userType(myForm))
  }

  useEffect(() => {
    if(error){
    
      alert.error(error);
      dispatch(clearErrors());

    }

    // if(!loading && isAuthenticated){
    //   navigate('/');
    // }
      
  }, [dispatch, error, alert, isAuthenticated, navigate, loading])

  
return (

    <Fragment>
      {loading ? <Loader/> : (

        <div className='usertype__container'>

          <div className='usertype__category__wrapper'>

              <div className='usertype__category__heading'>
                <p>Welcome here</p>
                <span className='usertype__category__heading__span'>Dont go back, complete the process <p>! !</p></span>
              </div>

              <form encType='multipart/form-data' onSubmit={typeSubmit}>
                <div className='usertype__category__sections'>
                  <div className='usertype__category__section'>
                    <label htmlFor='html1' className='usertype__category__section__label'>
                      <Radio 
                        name="type" 
                        id='html1' 
                        type='radio' 
                        onChange={() => handleChange({ target: { name: 'buyer', checked: !buyer } })}
                        checked={user.buyer}
                      />
                      <div className='usertype__category__section__type'>
                        <p>Become a Buyer</p>
                        <img src={costumer} alt="" />
                      </div>
                    </label>
                  </div>

                  <div className='usertype__category__section'>
                    <label htmlFor='html2' className='usertype__category__section__label'>
                      <Radio 
                        name="type" 
                        id='html2' 
                        type='radio' 
                        onChange={() => handleChange({ target: { name: 'seller', checked: !seller } })}
                        checked={user.seller}
                      />
                      <div className='usertype__category__section__type'>
                        <p>Become a Seller</p>
                        <img src={crossSelling} alt="" />
                      </div>
                    </label>
                  </div>

                  <div className='user__type__footer__submit'>
                    <button type='submit' value={userType} className={`user__type__footer__submit__btn ${!user.buyer && !user.seller ? 'btn-disabled' : ''}`}>
                        Confirm
                    </button>
                  </div>

                </div>

              </form>

          </div>

          <div className='usertype__hero__img'>
            <img src={userTypeImg} alt="" />
          </div>

        </div>
      )}
    </Fragment>
  )
}

export default UserType