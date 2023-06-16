import React,{useState} from 'react'
import {useSelector} from 'react-redux'
import {Link, useLocation} from 'react-router-dom'
import { Radio } from "@material-tailwind/react";
import {SlLocationPin} from 'react-icons/sl'
import {SiLevelsdotfyi} from 'react-icons/si'
import {CiMobile3} from 'react-icons/ci'
import {BsCheckLg} from 'react-icons/bs'
import {RxCross1} from 'react-icons/rx'
import { CSSTransition } from 'react-transition-group';

import "./ProjectPackages.css"


const ProjectPackages = ({packages, toggleDialogue, isOpen}) => {

  const location = useLocation();

  const {isAuthenticated} = useSelector((state)=>state.user);
  
  const [selectedPackage, setSelectedPackage] = useState(packages.types && packages.types.length > 0 && packages.types[0]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleRadioChange= (event) => {
      const selectedType = event.target.value;
      const packageInfo = packages.types.find((type)=>type.type === selectedType);
      setSelectedPackage(packageInfo);
  }


  const handleOrdeClick = () =>{
      console.log(selectedPackage);
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  }

  const removeFile = (index) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    })
  }

  // save user location
  const setLocationToLocalStorage = (location) => {
    localStorage.setItem('prevLocation', JSON.stringify(location));
  };

  const handleByClick = () => {
    setLocationToLocalStorage(location);
  }



  return (
    
    <div className="project__packages__container">
    
      
      <div className={`project__packages__user__detail ${isOpen ? 'blur' : ''}`}>

        <div className='project__packages__user__detail__country'>
          <span className='project__packages__user__detail__icon'><SlLocationPin size={30}/></span>
          <div className='project__packages__user__detail__settings'>
            <span>Location</span>
            <p>{packages.country}</p>
          </div>
        </div>

        <div className='project__packages__user__detail__language'>
          <span className='project__packages__user__detail__icon'><SiLevelsdotfyi size={30}/></span>
          <div className='project__packages__user__detail__settings'>
            {packages.language &&  packages.language.length > 0 && <span>{packages.language[0]} Level</span>}
            <p>{packages.language_control > 0 ? packages.language_control: 'Basic'}</p>
          </div>
        </div>

        <div className='project__packages__user__detail__response'>
          <span className='project__packages__user__detail__icon'><CiMobile3 size={30}/></span>
          <div className='project__packages__user__detail__settings'>
            <span>Response Rate</span>
            <p>{packages.response_rate > 0 ? packages.response_rate : 100}</p>
          </div>
        </div>

      </div>

      
      {packages.types && packages.types.length > 0 && (

      <div className={`project__packages__package__box__section ${isOpen ? 'blur' : ''}`}>

          <p className='project__packages__package__box__header__price'>${packages.types[0].price}</p>

        <div className='project__packages__box__selection__detail'>

          <div className='project__packeges__box__type__seclection'>
            {packages.types.map((type, index)=>(        
              <Radio 
                name="type" 
                className='project__packages__package__select' 
                defaultChecked={index === 0}
                type='radio'
                key={index}
                value={type.type}
                onChange={handleRadioChange}
              />
            ))}
          </div>

          <div className='project__packages__package__box__one'>

            <div className='project__packages__package__select__details'>
              
                <div className='project__packages__package__select__type'>
                    <span>{packages.types[0].type}</span>
                    <p>( {packages.types[0].deliverydays} + days )</p>
                </div>
            
              <div className='project__packages__package__select__quote'>
                <p>{packages.types[0].quote}</p>
              </div>

              <div className='project__packages__package__select__services'>
                <p>
                  <span><BsCheckLg size={23}/></span>
                  {packages.types[0].serviceone}
                </p>
                <p>
                  <span><BsCheckLg size={23}/></span>
                  {packages.types[0].servicetwo}
                </p>
                <p>
                  <span><BsCheckLg size={23}/></span>
                  {packages.types[0].servicethree}
                </p>
                <p>
                  <span><BsCheckLg size={23}/></span>
                  {packages.types[0].servicefour}
                </p>
              </div>

              <div className='project__packages__package__select__revisions'>
                <p>{packages.types[0].revisions} + revisions</p>
              </div>

              <div className='project__packages__package__select__price'>
                <p>${packages.types[0].price}</p>
              </div>

            </div>
            
            <div className='project__packages__package__select__details__divider'>
            </div>

            <div className='project__packages__package__select__details'>
              
                <div className='project__packages__package__select__type'>
                    <span>{packages.types[1].type}</span>
                    <p>( {packages.types[1].deliverydays} + days )</p>
                </div>
            
              <div className='project__packages__package__select__quote'>
                <p>{packages.types[1].quote}</p>
              </div>

              <div className='project__packages__package__select__services'>
                <p>
                  <span><BsCheckLg size={23}/></span>
                  {packages.types[1].serviceone}
                </p>
                <p>
                  <span><BsCheckLg size={23}/></span>
                  {packages.types[1].servicetwo}
                </p>
                <p>
                  <span><BsCheckLg size={23}/></span>
                  {packages.types[1].servicethree}
                </p>
                <p>
                  <span><BsCheckLg size={23}/></span>
                  {packages.types[1].servicefour}
                </p>
              </div>

              <div className='project__packages__package__select__revisions'>
                <p>{packages.types[1].revisions} + revisions</p>
              </div>

              <div className='project__packages__package__select__price'>
                <p>${packages.types[1].price}</p>
              </div>

            </div>

          </div>

        </div>

        <div className='project__packages__user__buy__project'>
          {isAuthenticated ? (
            <button className='project__packages__user__buy__project__btn' onClick={toggleDialogue}>
            Buy Now
          </button>
          ) : (
            <Link className='project__packages__user__buy__project__btn' to={"/login"} onClick={handleByClick}>
              Buy Now
            </Link>
          )}
        </div>

      </div>
      )}

      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="dialogue-animation"
        unmountOnExit
      >
        <div className='create__order__dialogue'>
              <button onClick={toggleDialogue} className='create__order__dialogue__close__btn'>
                <RxCross1 size={24}/>
              </button>
              <div className='create__order__dialogue__requirements'>
                <p>Requirements</p>
                <textarea name="message" id="" cols="30" rows="10" placeholder='Message'></textarea>
                <div className='create__order__dialogue__requirements__uploadfiles__container'>
                  <input 
                    type="file" 
                    name='Files' 
                    className='create__order__dialogue__requirements__uploadfiles'
                    multiple
                    onChange={handleFileChange}
                  />
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index} className='create__order__dialogue__requirements__uploaded__files'>
                        <RxCross1
                          onClick={() => removeFile(index)}
                          className='remove__files'
                          size={18}
                        />
                        <span>{file.name.slice(0, 4)}</span>
                        <span>
                          .{file.name.slice(file.name.lastIndexOf('.') + 1)}
                        </span>
                        
                      </li>
                      
                    ))}
                  </ul>
                </div>
              </div>
            <div className='create__order__dialogue__payment__btn'>
              <button className='project__packages__user__buy__project__btn' onClick={handleOrdeClick}>Payment</button>
            </div>
        </div>  
      </CSSTransition>
              
    </div>
  )
}

export default ProjectPackages