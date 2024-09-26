// store/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import globalReducer, { setMode } from "store/slices/modeSlice";
import authReducer, {
  setAuth,
  logout,
  setProfileImage,
} from "store/slices/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "state/api";
import { authApi } from "state/authApi";
import { dataManagementApi } from "state/dataManagementApi"; // Import your dataManagementApi

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Specify which reducers you want to persist
};

/**
 * Combine individual reducers into a single rootReducer.
 * When a component calls `dispatch()` from `useDispatch`, the action is sent to every reducer in the rootReducer.
 * The action object includes the action type and payload, which helps identify and trigger the relevant reducer.
 **/
const rootReducer = combineReducers({
  global: globalReducer,
  auth: authReducer, // Manages authentication-related state
  [api.reducerPath]: api.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [dataManagementApi.reducerPath]: dataManagementApi.reducer, // Manages data management API state
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer as the root reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required to avoid issues with redux-persist
    }).concat(api.middleware, authApi.middleware, dataManagementApi.middleware), // Add the dataManagementApi middleware
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export { store, persistor };
export { setAuth, logout, setProfileImage, setMode };
