import React,{useState, useEffect, Fragment} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Loader from '../../layout/loader/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {clearErrors, register} from '../../../actions/userAction'
import {useAlert} from 'react-alert';

import logo from '../../../assets/logo/splash.png'
import {BsUnlockFill, BsLockFill} from 'react-icons/bs'


import './Register.css'

const Register = () => {


  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const {error, loading, isAuthenticated} = useSelector((state)=>state.user);


  const [isValidForm, setIsValidForm] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});



  const [user, setUser] = useState({
      firstname: "",
      lastname: "",
      username: "",
      age: "",
      email: "",
      country: "",
      phoneno: "",
      password: "",
  })

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }))
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the error for the field
    }));
  }

  const {firstname, lastname, username, age, email, country, phoneno, password} = user

  // CHECK FORM VALIDITY
  const isValidate = () => {

    let isValid = true;
    const validationErrors = {};
  
    // Check if email is valid
    if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email is not valid";
      isValid = false;
    }
  
    // Check if password is at least 8 characters long
    if (password.length < 8) {
      validationErrors.password = "Password must be 8 letters long";
      isValid = false;
    }
  
    // Compare password and confirm password
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    } else if (password === confirmPassword) {
      validationErrors.confirmPassword = "Password Matched";
      isValid = true;
    }
  
    setIsValidForm(isValid);
    setErrors(validationErrors);
  
    return isValid;
  };


  const registerSubmit = (e) =>{
    e.preventDefault();

    if(isValidate()) {
      const myForm = new FormData();

      myForm.set("firstname", firstname);
      myForm.set("lastname", lastname);
      myForm.set("username", username.toLowerCase());
      myForm.set("age", age);
      myForm.set("email", email.toLowerCase());
      myForm.set("country", country);
      myForm.set("phoneno", phoneno);
      myForm.set("password", password);
      
      dispatch(register(myForm))
    }
  }

  useEffect(() => {
    if(error){
    
      alert.error(error);
      dispatch(clearErrors());

    }

      if(!loading && isAuthenticated){
        navigate('/userType');
      }
      
  }, [dispatch, error, alert, isAuthenticated, navigate, loading])

  // show and hide pass
  const [type, setType] = useState(false);

  const toggle = () => {
      setType(prevState => !prevState);

  }

return (

  <Fragment>

      {loading ? <Loader/> : (

        <div className='user__register__container'>

          <div className='user__register__section'>

            <div className='user__login__header'>
              <img src={logo} alt='logo'/>
              <div className='user__login__header__content'>
                <p>Welcome</p>
                <span>Please sign-in to your account</span>
              </div>
            </div>

            <div className='user__register__body'>

              <form encType='multipart/form-data' onSubmit={registerSubmit}>

                <div className='user__register__body__form'>

                  <div className='user__register__body__names'>
                    <div className='user__register__body__name_single'>
                      <input type='text' value={firstname} name='firstname' onChange={handleChange} required/>
                      <label for="first name">First name</label>
                    </div>
                    <div className='user__register__body__name_single'>
                      <input type='text' value={lastname} name='lastname' onChange={handleChange} required/>
                      <label for="Last name">Last name</label>
                    </div>
                  </div>

                  <div className='user__register__body__username_age'>
                    <div className='user__register__body__name_single'>
                      <input type='text' value={username} name='username' onChange={handleChange} required/>
                      <label for="Username">Username</label>
                    </div>
                    <div className='user__register__body__name_single'>
                      <input type='number' value={age} name='age' onChange={handleChange} required/>
                      <label for="Age">Age</label>
                    </div>
                  </div>
                  
                  <div className='user__register__body__name_single'>
                    <input type='email' value={email} name='email' onChange={handleChange} required/>
                    <label for="Email">Email</label>
                  </div>
                  {errors.email && <span className="warning-form">{errors.email}</span>}

                  <div className='user__register__body__country'>
                    <div className='user__register__body__name_single'>
                      <input type='text' value={country} name='country' onChange={handleChange} required/>
                      <label for="Country">Country</label>
                    </div>
                    <div className='user__register__body__name_single'>
                      <input type='number' value={phoneno} name='phoneno' onChange={handleChange} required/>
                      <label for="Phone no">Phone no</label>
                    </div>
                  </div>

                  <div className='user__register__body__password'>
                    <div className='user__register__body__name_single'>
                      <input type={type ? "text" : "password"}  value={password} name='password' onChange={handleChange} required/>
                      <label for="Password">Password</label>
                      <span className='user__login__body__password__eye' onClick={toggle}>
                        {type? <BsUnlockFill size={23}/> : <BsLockFill size={23}/> }
                      </span>
                    </div>
                    <div className='user__register__body__name_single'>
                      <input type={type ? "text" : "password"} required onChange={(e) => setConfirmPassword(e.target.value)}/>
                      <label for="Confirm Password">Confirm Password</label>
                      <span className='user__login__body__password__eye' onClick={toggle}>
                        {type? <BsUnlockFill size={23}/> : <BsLockFill size={23}/> }
                      </span>
                    </div>
                    {errors.confirmPassword && <div className="warning-form">{errors.confirmPassword}</div>}
                    <span>Password must greater then 8 & combination of capital and symbols</span>
                  </div>

                  <div className='user__login__to__regsiter'>
                    <p>Already have an account?</p>
                    <Link to='/login'>
                      <span>Login</span>
                    </Link>
                  </div>

                </div>

                <div className='user__register__footer__submit'>
                  <button type='submit' value={register}>
                      register
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

export default Register