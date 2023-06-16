import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/Routes/ProtectedRoute';

import NavBar from './components/layout/NavBar';
import HomeSection from './components/home/HomeSection';
import ProjectDetail from './components/project/ProjectDetail';

import Login from './components/user/authentication/Login';
import Register from './components/user/authentication/Register';
import UserType from './components/user/profile/UserType';


import DashboardHome from './components/user/dashboard/DashboardHome';
import Profile from './components/user/profile/Profile'

function App() {

  const [isOpen, setIsOpen] = useState(false);

  const toggleDialogue = () => {
    setIsOpen(!isOpen);
  };

  
  return (
  <BrowserRouter>



      <NavBar/>


      <div className="app_margin">

        <Routes>

        <Route path="/" element={<HomeSection />} />
        <Route path='/project/:slug' element={<ProjectDetail toggleDialogue={toggleDialogue} isOpen={isOpen}/> } />  


        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
          
        </Routes>
      
      </div>

     <div>
      <Routes>
        {/* dashboard */}
          <Route element={<ProtectedRoute/>}>
            <Route path="/userType" element={<UserType/>}/>
            <Route path="/DashboardHome" element={<DashboardHome/>}/>
            <Route path="/Profile" element={<Profile/>}/>
          </Route>
        {/* dashboard ends */}
      </Routes>
     </div>
 
    </BrowserRouter>
  );
}

export default App;
