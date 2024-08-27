import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dataManagementApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/data-management/" }),
  reducerPath: "dataManagementApi",
  tagTypes: ["Camera", "ParkingLot", "Document", "User"],
  endpoints: (build) => ({
    // Camera Endpoints
    getCameras: build.query({
      query: () => `camera/getAllCameras`, // Adjust this if there's a specific GET route
      providesTags: ["Camera"]
    }),
    addCamera: build.mutation({
      query: (newCamera) => ({
        url: `camera/addCamera`,
        method: "POST",
        body: newCamera,
      }),
      invalidatesTags: ["Camera"]
    }),
    updateCameraBlueprint: build.mutation({
      query: ({ cameraId, blueprint }) => ({
        url: `camera/updateBlueprintCamera`,
        method: "POST",
        body: { cameraId, blueprint },
      }),
      invalidatesTags: ["Camera"]
    }),
    removeCamera: build.mutation({
      query: (cameraId) => ({
        url: `camera/removeCamera`,
        method: "POST",
        body: { cameraId },
      }),
      invalidatesTags: ["Camera"]
    }),

    // ParkingLot Endpoints
    getParkingLots: build.query({
      query: () => `parkingLot/getAllParkingLots`, // Adjust this if there's a specific GET route
      providesTags: ["ParkingLot"]
    }),
    addParkingLot: build.mutation({
      query: (newParkingLot) => ({
        url: `parkingLot/addParkingLot`,
        method: "POST",
        body: newParkingLot,
      }),
      invalidatesTags: ["ParkingLot"]
    }),
    updateParkingLot: build.mutation({
      query: ({ parkingLotId, ...updatedParkingLot }) => ({
        url: `parkingLot/updateParkingLot`,
        method: "POST",
        body: { parkingLotId, ...updatedParkingLot },
      }),
      invalidatesTags: ["ParkingLot"]
    }),
    deleteParkingLot: build.mutation({
      query: (parkingLotId) => ({
        url: `parkingLot/deleteParkingLot`,
        method: "POST",
        body: { parkingLotId },
      }),
      invalidatesTags: ["ParkingLot"]
    }),

    // Document Endpoints
    getDocuments: build.query({
      query: () => `document/getAllDocuments`, // Adjust this if there's a specific GET route
      providesTags: ["Document"]
    }),
    addDocument: build.mutation({
      query: (newDocument) => ({
        url: `document/store`,
        method: "POST",
        body: newDocument,
      }),
      invalidatesTags: ["Document"]
    }),
    updateDocument: build.mutation({
      query: ({ documentId, ...updatedDocument }) => ({
        url: `document/update`,
        method: "POST",
        body: { documentId, ...updatedDocument },
      }),
      invalidatesTags: ["Document"]
    }),
    deleteDocument: build.mutation({
      query: (documentId) => ({
        url: `document/delete`,
        method: "POST",
        body: { documentId },
      }),
      invalidatesTags: ["Document"]
    }),

    // User Endpoints
    getUsers: build.query({
      query: () => `user/getAllUsers`, // Adjust this if there's a specific GET route
      providesTags: ["User"]
    }),
    updateUser: build.mutation({
      query: ({ userId, ...updatedUser }) => ({
        url: `user/updateUser`,
        method: "POST",
        body: { userId, ...updatedUser },
      }),
      invalidatesTags: ["User"]
    }),
    deleteUser: build.mutation({
      query: (userId) => ({
        url: `user/deleteUser`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["User"]

    }),
    getUserInformation: build.query({
        query: (userId) => ({
          url: `user/getUserInformation/${userId}`,
          method: "GET",
        }),
        providesTags: ["User"]
    }),
  }),
});



export const {
  useGetCamerasQuery, useAddCameraMutation, useUpdateCameraBlueprintMutation, useRemoveCameraMutation,
  useGetParkingLotsQuery, useAddParkingLotMutation, useUpdateParkingLotMutation, useDeleteParkingLotMutation,
  useGetDocumentsQuery, useAddDocumentMutation, useUpdateDocumentMutation, useDeleteDocumentMutation,
  useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation, useGetUserInformationQuery
} = dataManagementApi;
