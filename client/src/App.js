import React from 'react';
import Navbar from './React-Components/Navbar';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import CourseView from './React-Components/CourseView';
import CourseDetail from './React-Components/CourseDetail';
import Management from './React-Components/Management/Management';
import Dashboard from './React-Components/Dashboard/Dashboard';
import Schedule from './React-Components/Schedule';
import Profile from './React-Components/Profile';
import SignUp from './React-Components/UserAccess/SignUp';
import LogIn from './React-Components/UserAccess/LogIn';
import LogOut from './React-Components/UserAccess/LogOut';
import { useSelector } from 'react-redux';
import { selectAuth } from './redux/slices/authSlice';

function App() {
  const isAuth = useSelector(selectAuth);


  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar isAuth={isAuth} />
        <Routes>
          <Route
            exact
            path={'/'}
            element={<CourseView />}
          />
          <Route
            exact
            path={`/course/:id`}
            element={<CourseDetail />}
          />

          <Route
            exact
            path={'/dashboard'}
            element={<Dashboard />}
          >
            <Route path={''} element={<Dashboard />} />
            <Route
              path={':tutorAccountCourse'}
              element={<Dashboard />}
            />
          </Route>
          <Route
            exact
            path={`/management`}
            element={<Management />}
          />
          <Route
            exact
            path={'/schedule'}
            element={<Schedule/>}
          />
          <Route
            exact
            path={'/profile'}
            element={<Profile/>}
          />
          <Route
            exact
            path={'/logout'}
            element={
              <LogOut
                isAuth={isAuth}
              />
            }
          />

          <Route exact path={'/signup'} element={<SignUp />} />
          <Route exact path={'/login'} element={<LogIn isAuth={isAuth} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
