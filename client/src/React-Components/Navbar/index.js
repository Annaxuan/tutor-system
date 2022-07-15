import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
  FaLaptop,
  FaSignInAlt,
  FaSignOutAlt,
  FaCalendarAlt,
  FaUser,
  FaBook,
  FaUserCircle,
  FaThList,
} from 'react-icons/fa';

import './navbar.css';

import { useLogout } from '../../api/auth';
import { unauthenticateUser } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, logout } from '../../redux/slices/userSlice';
import { selectAuth } from '../../redux/slices/authSlice';
import { selectToken } from '../../redux/slices/authSlice';
import axios from 'axios';

// allow sending cookies
axios.defaults.withCredentials = true;

function Navbar(props) {
  const isAuth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const accessToken = useSelector(selectToken);
  // console.log('In navbar', accessToken);

  const [isMobile, setIsMobile] = useState(false);
  const { post: logoutUser, response } = useLogout(accessToken, {});

  const handleLogout = async () => {
    try {
      logoutUser();

      // console.log('response', response);
      if (response.ok) {
        dispatch(unauthenticateUser());
        dispatch(logout());
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <nav className='navbar'>
      <Link to='/' className='logo'>
        <img
          className='logo-image'
          src={require('../../images/logo.png')}
          alt='U+T logo'
        />
        U+T
      </Link>
      <ul
        className={isMobile ? 'navbar-links-mobile' : 'navbar-links'}
        onClick={() => setIsMobile(false)}
      >
        {/* <Link to='/' className='home'>
          <li>Home</li>
        </Link> */}
        <Link to='/' className='dashboard'>
          <li>
            <FaThList />
            &nbsp;Courses
          </li>
        </Link>
        {!isAuth ? (
          <>
            <Link to='/login' className='login'>
              <li>
                <FaSignInAlt />
                &nbsp;Login
              </li>
            </Link>
            <Link to='/signup' className='signup'>
              <li>
                <FaUser />
                &nbsp;Sign Up
              </li>
            </Link>
          </>
        ) : (
          <>
            {user && user.role === 'admin' && (
              <Link to='/management' className='dashboard'>
                <li>
                  <FaLaptop />
                  &nbsp;Management
                </li>
              </Link>
            )}

            <Link to='/dashboard' className='dashboard'>
              <li>
                <FaBook />
                &nbsp;Dashboard
              </li>
            </Link>
            <Link to='/schedule' className='schedule'>
              <li>
                <FaCalendarAlt />
                &nbsp;Schedule
              </li>
            </Link>
            <Link to='/profile' className='profile'>
              <li>
                <FaUserCircle />
                &nbsp;Profile
              </li>
            </Link>
            <Link
              onClick={() => handleLogout()}
              to='/logout'
              className='logout'
            >
              <li>
                <FaSignOutAlt />
                &nbsp;Log Out
              </li>
            </Link>
          </>
        )}
      </ul>
      <button
        className='navbar-menu-icon'
        onClick={() => setIsMobile(!isMobile)}
      >
        {isMobile ? (
          <CloseIcon color='primary' fontSize="small" />
        ) : (
          <MenuIcon color='primary' fontSize="small" />
        )}
      </button>
    </nav>
  );
}

export default Navbar;
