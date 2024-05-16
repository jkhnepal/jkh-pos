import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const distributeApi = createApi({
  reducerPath: "distribute",
  baseQuery,
  endpoints: (builder) => ({
    getAllDistribute: builder.query({
      query: ({ sort }) => {
        const params = {
          sort,
        };
        return {
          url: "/distributes",
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
          url: "/distributes/loki/loki/distributes-of-a-branch",
          params: params,
        };
      },
    }),

    getDistribute: builder.query({
      query: (distributeId) => `/distributes/${distributeId}`,
    }),

    createDistribute: builder.mutation({
      query: (newDistribute) => ({
        url: `/distributes`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newDistribute,
      }),
    }),

    updateDistribute: builder.mutation({
      query: ({ distributeId, updatedDistribute }) => ({
        url: `/distributes/${distributeId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedDistribute,
      }),
    }),

    acceptTheDistribute: builder.mutation({
      query: ({ distributeId, updatedDistribute }) => ({
        url: `/distributes/accept-the-distribute/${distributeId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedDistribute,
      }),
    }),

    deleteDistribute: builder.mutation({
      query: (distributeId) => ({
        url: `/distributes/${distributeId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateDistributeMutation, useAcceptTheDistributeMutation, useGetAllDistributeOfABranchQuery, useDeleteDistributeMutation, useGetAllDistributeQuery, useGetDistributeQuery, useUpdateDistributeMutation } = distributeApi;
