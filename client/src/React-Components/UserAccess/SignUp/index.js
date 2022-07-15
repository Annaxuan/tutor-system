import React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { onSignup } from '../../../api/auth';
import { Link } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

import '../index.css';

// username: 4 to 24 characters
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
// email: start with a word char, @ must exist in the middle
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
// password: 1 lower case letter, length between 4 and 15
const PASSWORD_REGEX = /^(?=.*[a-z]).{4,15}$/;
// const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{4,15}$/;

// SignUp functionality needs to rely on the backend to store the user info
// into the database

const SignUp = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [password2, setPassword2] = useState('');
  const [validPassword2, setValidPassword2] = useState(false);
  const [password2Focus, setPassword2Focus] = useState(false);

  const [role, setRole] = useState('student');

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // set the focus on the username input when the component loads
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(username);
    // console.log(result);
    // console.log('username', username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    // console.log(result);
    // console.log('email', email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    // console.log(result);
    // console.log('password', password);
    // console.log('password2', password2);
    setValidPassword(result);
    const match = password === password2;
    // console.log('match', match);
    setValidPassword2(match);
  }, [password, password2]);

  useEffect(() => {
    setErrMsg('');
  }, [username, email, password, password2]);

  const handleSubmit = async (e) => {
    // prevent from refreshing the page
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(username);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PASSWORD_REGEX.test(password);
    if (!v1 || !v2 || !v3) {
      setErrMsg('Invalid Entry');
      return;
    }
    // console.log(username, email, password, role);

    try {
      // server call
      const response = await onSignup(
        JSON.stringify({
          username,
          email,
          password,
          role,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      // console.log('ResponseData', response.data);
      // console.log('Response', JSON.stringify(response));
      setSuccess(true);
      // TODO: clear input fields
    } catch (error) {
      // console.log(error.response.data.error);
      // console.log(error.response);
      if (!error?.response) {
        setErrMsg('No Server Response');
      } else if (error.response?.status === 409) {
        setErrMsg('Username or Email already taken');
      } else {
        setErrMsg('Registration Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section className='user-form'>
          <h1>Success!</h1>
          <p>
            <Link to='/login' className='user-link'>
              Log In
            </Link>
          </p>
        </section>
      ) : (
        <>
          <div className='user-heading'>
            <h1>Welcome to U+T</h1>
            <p>Sign Up</p>
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
              {/* ------------- role ------------- */}
              <div className='user-radio-group'>
                <input
                  type='radio'
                  className='user-form-radio'
                  id='role0'
                  name='role'
                  value={'student'}
                  checked={role === 'student'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <b className='user-radio-student'>Student</b>
                <input
                  type='radio'
                  className='user-form-radio'
                  id='role1'
                  name='role'
                  value={'tutor'}
                  checked={role && role !== 'student'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <b>Tutor</b>
              </div>
              {/* <p className='radio-hint'>You are going to create a {+role === 0 ? 'student' : 'tutor'}'s account</p> */}
              <p className='user-radio-hint'>
                {role === 'student'
                  ? `You are going to create a student's account by default`
                  : `You are going to create a tutor's account`}
              </p>
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

              {/* ------------- email ------------- */}
              <div className='user-form-group'>
                <label htmlFor='email'>
                  Email:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validEmail ? 'user-valid' : 'user-hide'}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validEmail || !email ? 'user-hide' : 'user-invalid'
                    }
                  />
                </label>
                <input
                  type='email'
                  className='user-form-control'
                  autoComplete='off'
                  id='email'
                  name='email'
                  value={email}
                  placeholder='Enter your email'
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={validEmail ? 'false' : 'true'}
                  aria-describedby='emailnote'
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <p
                  id='emailnote'
                  className={
                    emailFocus && email && !validEmail
                      ? 'user-instructions'
                      : 'user-offscreen'
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must be a valid email address.
                  <br />
                  Must begin with a letter.
                  <br />
                  <span aria-label='at symbol'>@</span> needs to be in between.
                  <br />
                  <span aria-label='dot character'>.</span> must exists
                  somewhere after the <span aria-label='at symbol'>@</span>.
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
                  It's safter to include the following allowed special
                  characters: <span aria-label='exclamation mark'>!</span>{' '}
                  <span aria-label='at symbol'>@</span>{' '}
                  <span aria-label='hashtag'>#</span>{' '}
                  <span aria-label='dollar sign'>$</span>{' '}
                  <span aria-label='percent'>%</span>
                </p>
              </div>

              {/* ------------- password2 ------------- */}
              <div className='user-form-group'>
                <label htmlFor='confirm_pwd'>
                  Confirm Password:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={
                      validPassword2 && password2 ? 'user-valid' : 'user-hide'
                    }
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validPassword2 || !password2
                        ? 'user-hide'
                        : 'user-invalid'
                    }
                  />
                </label>
                <input
                  type='password'
                  className='user-form-control'
                  id='password2'
                  name='password2'
                  value={password2}
                  placeholder='Confirm password'
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  aria-invalid={validPassword2 ? 'false' : 'true'}
                  aria-describedby='password2note'
                  onFocus={() => setPassword2Focus(true)}
                  onBlur={() => setPassword2Focus(false)}
                />
                <p
                  id='password2note'
                  className={
                    password2Focus && !password2
                      ? 'user-instructions'
                      : 'user-offscreen'
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the above password input.
                </p>
              </div>
              <div className='user-form-group'>
                <button
                  disabled={
                    !validUsername ||
                    !validEmail ||
                    !validPassword ||
                    !validPassword2
                      ? true
                      : false
                  }
                  type='submit'
                  className='user-btn'
                >
                  Submit
                </button>
              </div>
              <p className='user-p-hint'>
                Already registered? You can&nbsp;
                <Link to='/login' className='user-link-blue'>
                  Log In
                </Link>
                &nbsp;here
              </p>
            </form>
          </section>
        </>
      )}
    </>
  );
};

export default SignUp;
