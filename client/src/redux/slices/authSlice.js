import { createSlice } from '@reduxjs/toolkit';

const userAuthFromLocalStorage = () => {
  const isAuth = localStorage.getItem('isAuth');

  if (isAuth && JSON.parse(isAuth) === true) {
    return true;
  }

  return false;
};

const accessTokenFromLocalStorage = () => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken && JSON.parse(accessToken)) {
    return JSON.parse(accessToken);
  }

  return null;
};

const initialState = {
  isAuth: userAuthFromLocalStorage(),
  accessToken: accessTokenFromLocalStorage(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state, action) => {
      state.isAuth = true;
      state.accessToken = action.payload.accessToken
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem(
        'accessToken',
        JSON.stringify(action.payload.accessToken)
      );
    },
    unauthenticateUser: (state) => {
      state.isAuth = false;
      state.accessToken = null
      localStorage.removeItem('isAuth');
      localStorage.removeItem('accessToken');
    },
  },
});

export const { authenticateUser, unauthenticateUser } = authSlice.actions;
export const selectAuth = (state) => state.auth.isAuth;
export const selectToken = (state) => state.auth.accessToken;

export default authSlice.reducer;
