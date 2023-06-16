import React,{useState, useEffect, Fragment} from "react";
import { useSelector } from "react-redux";
import store from "../../store";
import { userName, userLogOut } from "../../actions/userAction";
import {Link} from 'react-router-dom'
import {Navbar, MobileNav,Typography,Button,Menu, MenuHandler,MenuList, MenuItem,Avatar,Card,IconButton,} from "@material-tailwind/react";
import {CubeTransparentIcon,UserCircleIcon,CodeBracketSquareIcon,Square3Stack3DIcon,ChevronDownIcon,InboxArrowDownIcon,PowerIcon,RocketLaunchIcon,Bars2Icon,} from "@heroicons/react/24/outline";
import {SlLogin} from 'react-icons/sl'
import {RxDashboard} from 'react-icons/rx'
import logo from '../../assets/logo/splash.png'


import './css/NavBar.css'


 
function ProfileMenu() {

  const {isAuthenticated, user} = useSelector((state)=>state.user);


  useEffect(() => {

    store.dispatch(userName());

  }, []);

  const handleLogout = () => {
    store.dispatch(userLogOut());
    window.location.reload();
  };

  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  
  return(

    <Fragment>

      {isAuthenticated && isAuthenticated ? (
         
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
          <MenuHandler>
            <Button
              variant="text"
              color="blue-gray"
              className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
            >
            {user && user.profileImage && user.profileImage.link ? (
              <Avatar
                variant="circular"
                size="sm"
                alt="candice wu"
                className="border border-blue-500 p-0.5"
                src={user.profileImage.link}
              />
            ):(
              <div className="tailwind__dropdown__menu__img">
                {user && user.name &&
                  <p>{user.name[0]}</p>
                }
              </div>
            )}
            {user && user.name && (
              <p>{user.name}</p>
            )}
            
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </MenuHandler>

          <MenuList className="p-1 tailwind__dropdown__menu">
              return (

                <Link className="nav-link" to='/Profile'>
                  <MenuItem onClick={closeMenu} className='flex items-center gap-2 rounded'>
                    <UserCircleIcon className='h-4 w-4 strokeWidth: 2'/>
                    <Typography as="span" variant="small" className="font-normal">
                      My Profile
                    </Typography>
                  </MenuItem>
                </Link>

                <Link className="nav-link" to="/DashboardHome">
                  <MenuItem onClick={closeMenu} className='flex items-center gap-2 rounded'>
                    <RxDashboard className='h-4 w-4 strokeWidth: 2'/>
                    <Typography as="span" variant="small" className="font-normal">
                      Dashboard
                    </Typography>
                  </MenuItem>
                </Link>

                <Link className="nav-link">
                  <MenuItem onClick={closeMenu} className='flex items-center gap-2 rounded'>
                    <InboxArrowDownIcon className='h-4 w-4 strokeWidth: 2'/>
                    <Typography as="span" variant="small" className="font-normal">
                      Inbox
                    </Typography>
                  </MenuItem>
                </Link>

                <MenuItem onClick={() => {closeMenu(); handleLogout();}} className='flex items-center 200 gap-2 rounded'>
                  <PowerIcon className='text-red-300 h-4 w-4 strokeWidth: 2'/>
                  <Typography as="span" variant="small" className="font-normal text-red-300">
                    Logout
                  </Typography>
                </MenuItem>

              );
          </MenuList>
        </Menu>
       
      ):(

        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler >
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 lg:ml-auto"
          >
          <Link to="/login">
            <SlLogin
              variant="circular"
              alt="candice wu"
              className="p-0.5"
              size={30}
            />
          </Link>
          </Button>
        </MenuHandler>
      </Menu>

      )}

    </Fragment>

  )

}
 
// =========== here categoreis will be mapped 
// nav list menu
const navListMenuItems = [
  {
    title: "@material-tailwind/html",
    description:
      "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
  },
  {
    title: "@material-tailwind/react",
    description:
      "Learn how to use @material-tailwind/react, packed with rich components for React.",
  },
  {
    title: "Material Tailwind PRO",
    description:
      "A complete set of UI Elements for building faster websites in less time.",
  },
];
 
function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
 
  const triggers = {
    onMouseEnter: () => setIsMenuOpen(true),
    onMouseLeave: () => setIsMenuOpen(false),
  };
 
  const renderItems = navListMenuItems.map(({ title, description }) => (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a href="#" key={title}>
      <MenuItem>
        <Typography variant="h6" color="blue-gray" className="mb-1">
          {title}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {description}
        </Typography>
      </MenuItem>
    </a>
  ));
 
  return (
    <React.Fragment>
      <Menu open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem
              {...triggers}
              className="hidden items-center gap-2 text-blue-gray-900 lg:flex lg:rounded-full font-semibold text-gray-850"
            >
              <Square3Stack3DIcon className="h-[20px] w-[20px]" />

                <Typography variant="h6" className="font-semibold text-gray-800 outline-none">
                  Pages
                </Typography>
                
                {" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList
          {...triggers}
          className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid"
        >
          <Card
            color="blue"
            shadow={false}
            variant="gradient"
            className="col-span-3 grid h-full w-full place-items-center rounded-md"
          >
            <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
          </Card>
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 text-gray-800 lg:hidden text-gray-850">
        <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}

// =============================================





// nav list component
const navListItems = [
  {
    label: "Find Job",
    icon: UserCircleIcon,
  },
  {
    label: "Why us?",
    icon: CubeTransparentIcon,
  },
  {
    label: "Docs",
    icon: CodeBracketSquareIcon,
  },
];
 
function NavList() {
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-6 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <NavListMenu />
      {navListItems.map(({ label, icon }, key) => (
        <Typography
          key={label}
          as="a"
          href="#"
          variant="h6"
          className="font-semibold text-gray-800"
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
            {label}
          </MenuItem>
        </Typography>
      ))}
      
    </ul>
  );
}
 


export default function NavBar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);
 
  return (
    <Navbar className="mx-auto max-w-screen-4xl h-20 lg:rounded-lg lg:pl-6">
      
      <div className="relative mx-auto flex items-center bottom-1 text-blue-gray-900 xl:pl-36 xl:pr-36">
        
        <Typography as="a" href="#" className="mr-4 ml-2 cursor-pointer">
          <Link to='/'>
            <img src={logo} alt="logo" width={130}/>
          </Link>
        </Typography>
        
        <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
          <NavList />
        </div>


        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"

          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
        
        <ProfileMenu />
      </div>


      <MobileNav open={isNavOpen} className="overflow-scroll">
        <NavList />
      </MobileNav>

      
    </Navbar>
  );
}