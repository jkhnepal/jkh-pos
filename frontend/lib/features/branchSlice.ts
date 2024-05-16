import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

// Define common headers
const headers = { "Content-Type": "application/json" };

export const branchApi = createApi({
  reducerPath: "branch",
  baseQuery,
  endpoints: (builder) => ({
    createBranch: builder.mutation({
      query: (newBranch) => ({
        url: `/branches`,
        method: "POST",
        headers,
        body: newBranch,
      }),
    }),

    getAllBranch: builder.query({
      query: ({ sort }) => {
        const params = {
          sort,
        };
        return {
          url: "/branches",
          params: params,
        };
      },
    }),

    getBranch: builder.query({
      query: (branchId) => `/branches/${branchId}`,
    }),

    updateBranch: builder.mutation({
      query: ({ branchId, updatedBranch }) => ({
        url: `/branches/${branchId}`,
        method: "PATCH",
        headers,
        body: updatedBranch,
      }),
    }),

    deleteBranch: builder.mutation({
      query: (branchId) => ({
        url: `/branches/${branchId}`,
        method: "DELETE",
      }),
    }),

    // Auth
    loginBranch: builder.mutation({
      query: (credential) => ({
        url: `/branches/login`,
        method: "POST",
        headers,
        body: credential,
      }),
    }),

    resetPassword: builder.mutation({
      query: (email) => {
        return {
          url: `/branches/reset-password/${email}`,
          method: "PATCH",
          headers,
        };
      },
    }),
  }),
});

export const { useCreateBranchMutation, useLoginBranchMutation, useResetPasswordMutation, useDeleteBranchMutation, useGetAllBranchQuery, useGetBranchQuery, useUpdateBranchMutation } = branchApi;
