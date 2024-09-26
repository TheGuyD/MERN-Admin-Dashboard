// store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
/**
 * The `createSlice` function simplifies the process of creating Redux reducers and actions.
 *
 * In Redux, a reducer is a function that takes the current state and an action, and returns a new state. It is similar to `useState` in React but is more suitable when managing complex or related state variables (e.g., when multiple pieces of state need to be updated together).
 *
 * A reducer consists of two main parts: state and action. The state holds the variables (usually as an object, as in our `initialState`), and the action describes the changes to be made to the state.
 *
 * An action object typically has the form `{ type: 'ACTION_TYPE', payload: data }`. The `type` specifies the type of action to perform, and the `payload` contains any data needed to update the state.
 *
 * To update the state managed by a reducer, we dispatch an action object using the `dispatch` function.
 *
 * The `reducers` field in the `authSlice` defines the reducer functions that handle specific actions and update the state accordingly. It centralizes the logic for state updates in one place.
 */

const initialState = {
  userId: null,
  accessToken: null,
  profileImage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  // mini reducers - each mini reducer update specific parts if the state ( NOT THE BIG STATE / THE MOTHER OF ALL STATES IN THE STORE , IT IS THE PICECE OF STATE MANAGED BY THIS REDUCER)
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
    // TODO: Consider what would be more convenient: saving all user information in this slice (authSlice), in the modeSlice, or starting a new informationSlice?
    setProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
  },
});

// export the mini reducers ( the reducers functions )
export const { setAuth, logout, setProfileImage } = authSlice.actions;

// the authSlice.reducer is a function that centralize mini reducers functions
export default authSlice.reducer;
