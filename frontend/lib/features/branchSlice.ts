import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const branchApi = createApi({
  reducerPath: "branch",
  baseQuery,
  endpoints: (builder) => ({
    getAllBranch: builder.query({
      query: () => "/branches",
    }),

    getBranch: builder.query({
      query: (branchId) => `/branches/${branchId}`,
    }),

    createBranch: builder.mutation({
      query: (newBranch) => ({
        url: `/branches`,
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: newBranch,
      }),
    }),

    loginBranch: builder.mutation({
      query: (credential) => ({
        url: `/branches/login`,
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: credential,
      }),
    }),

    updateBranch: builder.mutation({
      query: ({ branchId, updatedBranch }) => ({
        url: `/branches/${branchId}`,
        method: "PATCH",
        // headers: { "Content-Type": "application/json" },
        body: updatedBranch,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ email_phone }) => {
        console.log("Resetting password for:", email_phone);
        return {
          url: `/branches/reset-password/${email_phone}`,
          method: "PATCH",
          // headers: { "Content-Type": "application/json" },
        };
      },
    }),

    deleteBranch: builder.mutation({
      query: (branchId) => ({
        url: `/branches/${branchId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateBranchMutation, useLoginBranchMutation, useResetPasswordMutation, useDeleteBranchMutation, useGetAllBranchQuery, useGetBranchQuery, useUpdateBranchMutation } = branchApi;
