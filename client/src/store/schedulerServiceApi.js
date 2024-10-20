import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const schedulerServiceApi = createApi({
  reducerPath: "schedulerServiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/scheduler/",
    credentials: "include",
  }),
  tagTypes: ["Scheduler"],
  endpoints: (build) => ({
    scheduleTask: build.mutation({
      query: (body) => ({
        url: `scheduleTask`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Scheduler"],
    }),
    cancelTask: build.mutation({
      query: (parkingLotId) => ({
        url: `cancelTask/${parkingLotId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Scheduler"],
    }),
  }),
});

export const { useScheduleTaskMutation, useCancelTaskMutation } = schedulerServiceApi;
