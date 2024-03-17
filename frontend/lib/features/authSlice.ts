import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery,
  endpoints: (builder) => ({
    getCurrentUserFromToken: builder.query({
      query: () => ({
        url: `/auth/get-current-admin`,
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
    }),
  }),
});

export const { useGetCurrentUserFromTokenQuery } = authApi;
