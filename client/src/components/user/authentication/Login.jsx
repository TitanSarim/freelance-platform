import React,{useState, useEffect, Fragment} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import Loader from '../../layout/loader/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {clearErrors, login} from '../../../actions/userAction'
import {useAlert} from 'react-alert';

import logo from '../../../assets/logo/splash.png'
import {BsUnlockFill, BsLockFill} from 'react-icons/bs'


import './Login.css'





const Login = () => {


  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  // const getLocationFromLocalStorage = () => {
  //   const location = localStorage.getItem('prevLocation');
  //   return location ? JSON.parse(location) : null;
  // };

  const {error, loading, isAuthenticated} = useSelector((state)=>state.user);


  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [prevLocation, setPrevLocation] = useState(null);
  const [isValidForm, setIsValidForm] = useState(true);

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  }

  useEffect(() => {

    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }

    if(isAuthenticated){

      const prevLocation = localStorage.getItem('prevLocation');

      if(prevLocation){
        const parsedPrevLocation = JSON.parse(prevLocation);
        navigate(parsedPrevLocation, { replace: true })
        localStorage.removeItem('prevLocation');
      }else{
        navigate('/', { replace: true })
      }
      
    }


  }, [dispatch, alert, error, isAuthenticated, navigate, prevLocation])

  // CHECK FORM VALIDITY
  const isValidate = () => {

    let isValid = true;
  
    // Check if email is valid
    if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      isValid = false;
    }
  
    // Check if password is at least 6 characters long
    if (loginPassword.length < 8) {
      isValid = false;
    }
    
    setIsValidForm(isValid);

    return isValid;
  }
  
  
  const handleLogin = (e) => {
    
    const {state} = location;
    if(state && state.form){
      setPrevLocation(state.form)
    }

    e.preventDefault();

    if(isValidate()){
      dispatch(login(loginEmail, loginPassword))
    }

  }

  // show and hide pass
  const [type, setType] = useState(false);

  const toggle = () => {
      setType(prevState => !prevState);

  }


  return (
    
    <Fragment>

      {loading ? <Loader/> : (

        
      
      <div className='user__login__container'>

      <div className='user__login__section'>

        <div className='user__login__header'>
          <img src={logo} alt='logo'/>
          <div className='user__login__header__content'>
            <p>Welcome</p>
            <span>Please sign-in to your account</span>
          </div>
        </div>

        <div className='user__login__body'>

          <form onSubmit={loginSubmit} noValidate>

          <div className='user__login__body__form'>
            
            <div>
              <div className='user__login__body__email'>
                <input type='email' required value={loginEmail} onChange={(e) =>setLoginEmail(e.target.value.toLowerCase())}/>
                <label for="email">Email</label>
              </div>
              {!isValidForm && (
                  <span className='user__login__body__email__error'>
                    Please enter a valid Email
                  </span>
              )}
            </div>

            <div>
              <div className='user__login__body__password'>
                <input type={type ? "text" : "password"} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                <label for="password">Password</label>
                <span className='user__login__body__password__eye' onClick={toggle}>
                  {type? <BsUnlockFill size={23}/> : <BsLockFill size={23}/> }
                </span>
              </div>
              {!isValidForm && (
                <span className='user__login__body__email__error'>
                  Please enter a valid Password
                </span>
              )}
            </div>

            <div className='user__login__body__forget'>
              <p>Forget your password?</p>
            </div>
            
            <div className='user__login__to__regsiter'>
              <p>New on our platform?</p>
              <Link to='/register'>
                <span>Create an account</span>
              </Link>
            </div>

          </div>

          <div className='user__login__footer__submit'>
            <button type='submit' value="Login" onClick={handleLogin}>
                Login
            </button>
          </div>

          </form>

        </div>
      
      </div>


      </div>


    )}

    </Fragment>
  
  )
}

export default Login