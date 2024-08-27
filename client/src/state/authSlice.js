import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { userId, accessToken } = action.payload;
      state.userId = userId;
      state.accessToken = accessToken;
    },
    logout: (state) => {
      state.userId = null;
      state.accessToken = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;

export default authSlice.reducer;
