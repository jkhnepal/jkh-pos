import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

// Define common headers
const headers = { "Content-Type": "application/json" };

export const settingApi = createApi({
  reducerPath: "setting",
  baseQuery,
  endpoints: (builder) => ({
    getAllSetting: builder.query({
      query: () => {
        return {
          url: "/settings",
        };
      },
    }),

    updateSetting: builder.mutation({
      query: ({ settingId, updatedSetting }) => ({
        url: `/settings/${settingId}`,
        method: "PATCH",
        headers,
        body: updatedSetting,
      }),
    }),
  }),
});

export const { useGetAllSettingQuery, useUpdateSettingMutation } = settingApi;
