import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dataManagementApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/data-management/",
    credentials: 'include',
  }),
  reducerPath: "dataManagementApi",
  tagTypes: ["Camera", "ParkingLot", "Document", "User"],
  endpoints: (build) => ({
    // Camera Endpoints
    getCameras: build.query({
      query: (parkingLotId) => `camera/getCameras/${parkingLotId}`,
      providesTags: ["Camera"],
    }),
    addCamera: build.mutation({
      query: (newCamera) => ({
        url: 'camera/addCamera',
        method: 'POST',
        body: newCamera,
      }),
      invalidatesTags: ["Camera"],
    }),
    updateCamera: build.mutation({
      query: (updatedCamera) => ({
        url: `camera/updateCamera/${updatedCamera.id}`,
        method: 'PUT',
        body: updatedCamera,
      }),
      invalidatesTags: ['Camera'],
    }),
    deleteCamera: build.mutation({
      query: (cameraId) => ({
        url: `camera/deleteCamera/${cameraId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Camera'],
    }),
    removeCamera: build.mutation({
      query: (cameraId) => ({
        url: `camera/removeCamera`,
        method: "POST",
        body: { cameraId },
      }),
      invalidatesTags: ["Camera"],
    }),

    getCamera: build.query({
      query: (cameraId) => `camera/getCamera/${cameraId}`,
      providesTags: ["Camera"],
    }),

    getCameraDocuments: build.query({
      query: ({ cameraId, page, pageSize, sort, search }) => ({
        url: `document/getCameraDocuments/${cameraId}`,
        method: 'GET',
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Document"],
    }),

    // ParkingLot Endpoints
    getAllParkingLotsByUserId: build.query({
      query: (userId) => `parkingLot/getAllParkingLotsByUserId/${userId}`,
      providesTags: ["ParkingLot"],
    }),
    addParkingLot: build.mutation({
      query: (newParkingLot) => ({
        url: `parkingLot/addParkingLot`,
        method: "POST",
        body: newParkingLot,
      }),
      invalidatesTags: ["ParkingLot"],
    }),
    updateParkingLot: build.mutation({
      query: ({ parkingLotId, ...updatedParkingLot }) => ({
        url: `parkingLot/updateParkingLot`,
        method: "POST",
        body: { parkingLotId, ...updatedParkingLot },
      }),
      invalidatesTags: ["ParkingLot"],
    }),
    deleteParkingLot: build.mutation({
      query: (parkingLotId) => ({
        url: `parkingLot/deleteParkingLot`,
        method: "POST",
        body: { parkingLotId },
      }),
      invalidatesTags: ["ParkingLot"],
    }),

    createParkingLotFolderStructure: build.mutation({
      query: (userId, parkingLotId) => ({
        url: `parkingLot/createParkingLotFolderStructure`,
        method: "POST",
        body: { userId, parkingLotId },
      }),
      invalidatesTags: ["ParkingLot"],
    }),

    // Document Endpoints
    getDocuments: build.query({
      query: () => `document/getAllDocuments`, // Adjust this if there's a specific GET route
      providesTags: ["Document"],
    }),
    addDocument: build.mutation({
      query: (newDocument) => ({
        url: `document/store`,
        method: "POST",
        body: newDocument,
      }),
      invalidatesTags: ["Document"],
    }),
    updateDocument: build.mutation({
      query: ({ documentId, ...updatedDocument }) => ({
        url: `document/update`,
        method: "POST",
        body: { documentId, ...updatedDocument },
      }),
      invalidatesTags: ["Document"],
    }),
    deleteDocument: build.mutation({
      query: (documentId) => ({
        url: `document/delete`,
        method: "POST",
        body: { documentId },
      }),
      invalidatesTags: ["Document"],
    }),

    // User Endpoints
    getUsers: build.query({
      query: () => `user/getAllUsers`, // Adjust this if there's a specific GET route
      providesTags: ["User"],
    }),
    updateUser: build.mutation({
      query: ({ ...updatedUser }) => ({
        url: `user/updateUser`,
        method: "POST",
        body: { ...updatedUser },
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: build.mutation({
      query: (userId) => ({
        url: `user/deleteUser`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["User"],
    }),
    getUserInformation: build.query({
      query: (userId) => ({
        url: `user/getUserInformation/${userId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    createUserFolderStructure: build.mutation({
      query: (userId) => ({
        url: `user/createUserFolderStructure`,
        method: `POST`,
        body: userId,
      }),
      providesTags: ["User"],
    }),
    uploadPhoto: build.mutation({
      query: ({ image, path }) => {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("path", path);

        return {
          url: `user/uploadPhoto`,
          method: "POST",
          body: formData,
        };
      },
    }),
    retriveImage: build.query({
      query: ({ imageName, path }) => ({
        url: `user/retriveImage`,
        method: "POST",
        body: { imageName, requestedPath: path },
      }),
    }),
  }),
});

export const {
  useGetCamerasQuery,
  useAddCameraMutation,
  useUpdateCameraMutation,
  useDeleteCameraMutation,
  useRemoveCameraMutation,
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
} = dataManagementApi;
