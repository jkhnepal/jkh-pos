import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const distributeApi = createApi({
  reducerPath: "distribute",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/distributes" }),
  endpoints: (builder) => ({
    // getAllDistribute: builder.query({
    //   query: (options) => {
    //     const { branch } = options;
    //     const params = branch ? { branch } : {};
    //     return {
    //       url: "/",
    //       params: params,
    //     };
    //   },
    // }),

    getAllDistribute: builder.query({
      query: ({ page = 1, limit = 5, search, sort }) => {
        const params = {
          page,
          limit,
          search,
          sort,
        };
        return {
          url: "/",
          params: params,
        };
      },
    }),

    getDistribute: builder.query({
      query: (distributeId) => `/${distributeId}`,
    }),

    createDistribute: builder.mutation({
      query: (newDistribute) => ({
        url: ``,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newDistribute,
      }),
    }),

    updateDistribute: builder.mutation({
      query: ({ distributeId, updatedDistribute }) => ({
        url: `/${distributeId}`,
        method: "PATCH",
        // headers: { "Content-Type": "application/json" },
        body: updatedDistribute,
      }),
    }),

    deleteDistribute: builder.mutation({
      query: (distributeId) => ({
        url: `/${distributeId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateDistributeMutation, useDeleteDistributeMutation, useGetAllDistributeQuery, useGetDistributeQuery, useUpdateDistributeMutation } = distributeApi;
