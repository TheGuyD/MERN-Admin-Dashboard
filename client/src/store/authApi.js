import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuth, logout } from "./index"; // Import your actions

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    console.log("Sending refresh token request...");

    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      api.dispatch(
        setAuth({
          userId: refreshResult.data.userId,
          accessToken: refreshResult.data.accessToken,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const authApi = createApi({
  baseQuery: baseQueryWithReauth,
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
