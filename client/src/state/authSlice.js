import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  accessToken: null,
  profileImage: null,
};

const authSlice = createSlice({
  name: "auth",
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
      state.profileImage = null;
    },
    //TODO: what will be more convinient, to save all user information in this slice , modeSlice or start new infoemationSlice?
    setProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
  },
});

export const { setAuth, logout, setProfileImage } = authSlice.actions;

export default authSlice.reducer;
