import React, { useState, useRef, useEffect } from 'react';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { onLogin } from '../../../api/auth';
import '../index.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authenticateUser } from '../../../redux/slices/authSlice';
import { login } from '../../../redux/slices/userSlice';
import axios from 'axios';

// allow sending cookies
axios.defaults.withCredentials = true;

const Login = (props) => {
  // username: 4 to 24 characters
  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  // password: 1 lower case letter, length between 4 and 15
  const PASSWORD_REGEX = /^(?=.*[a-z]).{4,15}$/;
  // const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{4,15}$/;

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  // set the focus on the username input when the component loads
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidUsername(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // Warning: Can't perform a React state update on an unmounted component.
  // This is a no-op, but it indicates a memory leak in your application.
  // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.

  // The following _isMounted is defined to fix the Warning above.
  const _isMounted = useRef(true); // Initial value _isMounted = true

  useEffect(() => {
    return () => {
      // ComponentWillUnmount in Class Component
      _isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    // prevent from refreshing the page
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(username);
    const v2 = PASSWORD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry');
      return;
    }

    try {
      const response = await onLogin({
        username,
        password,
      });

      // Could clear input fields here

      const accessToken = response.data.accessToken;

      dispatch(authenticateUser({ accessToken }));

      const userData = response.data.userInfo;
      dispatch(login(userData));

      navigate('/');
    } catch (error) {
      if (!error?.response) {
        setErrMsg('No Server Response');
      } else if (error.response?.status === 401) {
        setErrMsg('Invalid Username or Password');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      <div className='user-heading'>
        <h1>Welcome to U+T</h1>
        <p>Log In</p>
      </div>

      <p
        ref={errRef}
        className={errMsg ? 'user-errmsg' : 'user-offscreen'}
        aria-live='assertive'
      >
        {errMsg}
      </p>
      <section className='user-form'>
        <form onSubmit={handleSubmit}>
          <br></br>

          {/* ------------- username ------------- */}

          <div className='user-form-group'>
            <label htmlFor='username'>
              Username:
              <FontAwesomeIcon
                icon={faCheck}
                className={validUsername ? 'user-valid' : 'user-hide'}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  validUsername || !username ? 'user-hide' : 'user-invalid'
                }
              />
            </label>
            <input
              type='text'
              className='user-form-control'
              ref={userRef}
              autoComplete='off'
              id='username'
              name='username'
              value={username}
              placeholder='Enter your username'
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-invalid={validUsername ? 'false' : 'true'}
              aria-describedby='uidnote'
              onFocus={() => setUsernameFocus(true)}
              onBlur={() => setUsernameFocus(false)}
            />
            <p
              id='uidnote'
              className={
                usernameFocus && username && !validUsername
                  ? 'user-instructions'
                  : 'user-offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
          </div>

          {/* ------------- password ------------- */}

          <div className='user-form-group'>
            <label htmlFor='password'>
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPassword ? 'user-valid' : 'user-hide'}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  validPassword || !password ? 'user-hide' : 'user-invalid'
                }
              />
            </label>
            <input
              type='password'
              className='user-form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={validPassword ? 'false' : 'true'}
              aria-describedby='passwordnote'
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              id='passwordnote'
              className={
                passwordFocus && !validPassword
                  ? 'user-instructions'
                  : 'user-offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 15 characters.
              <br />
              Must include lowercase letters
              <br />
              The following special characters are allowed:{' '}
              <span aria-label='exclamation mark'>!</span>{' '}
              <span aria-label='at symbol'>@</span>{' '}
              <span aria-label='hashtag'>#</span>{' '}
              <span aria-label='dollar sign'>$</span>{' '}
              <span aria-label='percent'>%</span>
            </p>
          </div>

          <div className='user-form-group'>
            <button
              disabled={!validUsername || !validPassword ? true : false}
              type='submit'
              className='user-btn'
            >
              Submit
            </button>
          </div>

          <p className='user-p-hint'>
            Not have an account? You can&nbsp;
            <Link to='/signup' className='user-link-blue'>
              Sign Up
            </Link>
            &nbsp;here
          </p>
        </form>
      </section>
    </>
  );
};

export default Login;
