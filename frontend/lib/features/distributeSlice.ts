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
      query: ({ branch, page = 1, limit = 5, search, sort }) => {
        const params = {
          branch,
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

    getAllDistributeOfABranch: builder.query({
      query: ({ branch, page = 1, limit = 5, search, sort }) => {
        const params = {
          branch,
          page,
          limit,
          search,
          sort,
        };
        return {
          url: "/loki/loki/distributes-of-a-branch",
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
        headers: { "Content-Type": "application/json" },
        body: updatedDistribute,
      }),
    }),


    acceptTheDistribute: builder.mutation({
      query: ({ distributeId, updatedDistribute }) => ({
        url: `/accept-the-distribute/${distributeId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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

export const { useCreateDistributeMutation, useAcceptTheDistributeMutation, useGetAllDistributeOfABranchQuery, useDeleteDistributeMutation, useGetAllDistributeQuery, useGetDistributeQuery, useUpdateDistributeMutation } = distributeApi;
