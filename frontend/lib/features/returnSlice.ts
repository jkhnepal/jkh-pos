import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

// Define common headers
const headers = { "Content-Type": "application/json" };

export const returnApi = createApi({
  reducerPath: "return",
  baseQuery,
  endpoints: (builder) => ({
    createReturn: builder.mutation({
      query: (newReturn) => ({
        url: `/returns`,
        method: "POST",
        headers,
        body: newReturn,
      }),
    }),

    getAllReturn: builder.query({
      query: ({ branch, page = 1, limit = 5, search, sort }) => {
        const params = {
          branch,
          page,
          limit,
          search,
          sort,
        };
        return {
          url: "/returns",
          params: params,
        };
      },
    }),

    getReturn: builder.query({
      query: (returnId) => `/returns/${returnId}`,
    }),
  }),
});

export const { useCreateReturnMutation, useGetAllReturnQuery, useGetReturnQuery } = returnApi;
