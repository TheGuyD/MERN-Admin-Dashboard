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
import { api } from "store/api";
import {
  authApi,
  useSignupMutation,
  useLoginMutation,
  useRefreshQuery,
  useLogoutMutation,
} from "store/authApi";
import {
  dataManagementApi,
  useGetCamerasQuery,
  useAddCameraMutation,
  useUpdateCameraMutation,
  useDeleteCameraMutation,
  useRemoveCameraMutation,
  useRemoveCameraDocsMutation,
  useGetAllParkingLotsByUserIdQuery,
  useAddParkingLotMutation,
  useUpdateParkingLotMutation,
  useDeleteParkingLotMutation,
  useGetDocumentsQuery,
  useAddDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserInformationQuery,
  useCreateUserFolderStructureMutation,
  useUploadPhotoMutation,
  useRetriveImageQuery,
  useCreateParkingLotFolderStructureMutation,
  useGetCameraQuery,
  useGetCameraDocumentsQuery,
  useSaveSchedulerTaskMutation,
  useDeleteSchedulerTaskMutation
} from "store/dataManagementApi"; // Import your dataManagementApi

import { useScheduleTaskMutation , useCancelTaskMutation , schedulerServiceApi } from "store/schedulerServiceApi"

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
  [schedulerServiceApi.reducerPath]: schedulerServiceApi.reducer
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer as the root reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required to avoid issues with redux-persist
    }).concat(api.middleware, authApi.middleware, dataManagementApi.middleware, schedulerServiceApi.middleware), // Add the dataManagementApi middleware
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export { store, persistor };
export { setAuth, logout, setProfileImage, setMode };
export {
  useSignupMutation,
  useLoginMutation,
  useRefreshQuery, // TODO: why this is not in use ?
  useLogoutMutation,
};

export {
  useGetCamerasQuery,
  useAddCameraMutation,
  useUpdateCameraMutation,
  useDeleteCameraMutation,
  useRemoveCameraMutation, // TODO: why this is not in use ?
  useRemoveCameraDocsMutation,
  useGetAllParkingLotsByUserIdQuery,
  useAddParkingLotMutation,
  useUpdateParkingLotMutation,
  useDeleteParkingLotMutation,
  useGetDocumentsQuery,// TODO: why this is not in use ?
  useAddDocumentMutation, // TODO: why this is not in use ?
  useUpdateDocumentMutation, // TODO: why this is not in use ?
  useDeleteDocumentMutation, // TODO: why this is not in use ?
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserInformationQuery,
  useCreateUserFolderStructureMutation,
  useUploadPhotoMutation,
  useRetriveImageQuery,
  useCreateParkingLotFolderStructureMutation, // TODO: why this is not in use ?
  useGetCameraQuery,
  useGetCameraDocumentsQuery,
  useSaveSchedulerTaskMutation,
  useDeleteSchedulerTaskMutation
};

export { useScheduleTaskMutation , useCancelTaskMutation }

