import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }), // new base URL for auth
  reducerPath: "authApi",
  tagTypes: ["Register", "Login", "Refresh", "Logout"],
  endpoints: (build) => ({
    signup: build.mutation({
      query: (newUser) => ({
        url: "auth/signup",
        method: "POST",
        body: newUser,
      }),
      providesTags: ["Register"],
    }),
    login: build.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      providesTags: ["Login"],
    }),
    refresh: build.query({
      query: () => ({
        url: "auth/refresh",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Refresh"],
    }),
    logout: build.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
        credentials: "include",
      }),
      providesTags: ["Logout"],
    }),
  }),
});

export const {
    useSignupMutation,
    useLoginMutation,
    useRefreshQuery,
    useLogoutMutation,
  } = authApi;
  