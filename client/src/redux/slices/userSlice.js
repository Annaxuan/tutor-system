import { createSlice } from '@reduxjs/toolkit';

const userFromLocalStorage = () => {
  const user = localStorage.getItem('user');

  if (user && JSON.parse(user)) {
    return JSON.parse(user);
  }

  return null;
};

const initialState = {
  userData: userFromLocalStorage(),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userData = null;
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = userSlice.actions;
export const selectUser = (state) => state.user.userData;

export default userSlice.reducer;
