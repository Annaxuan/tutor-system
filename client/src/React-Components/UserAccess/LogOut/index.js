import React from 'react';
import '../index.css';
import { Link } from 'react-router-dom';

const LogOut = (props) => {
  return (
    <>
      <div className='user-heading'>You have logged out successfully.</div>
      <section className='user-paragraph-link'>
        <p className='user-p-hint'>
          You can click here to&nbsp;
          <Link to='/login' className='user-link'>
            Log In
          </Link>
          &nbsp;again.
        </p>
      </section>
    </>
  );
};

export default LogOut;
