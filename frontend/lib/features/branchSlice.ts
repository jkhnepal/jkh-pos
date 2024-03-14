import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const branchApi = createApi({
  reducerPath: "branch",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/branches" }),
  endpoints: (builder) => ({
    getAllBranch: builder.query({
      query: () => "/",
    }),

    getBranch: builder.query({
      query: (branchId) => `/${branchId}`,
    }),

    createBranch: builder.mutation({
      query: (newBranch) => ({
        url: ``,
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: newBranch,
      }),
    }),

    loginBranch: builder.mutation({
      query: (credential) => ({
        url: `/login`,
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: credential,
      }),
    }),

    updateBranch: builder.mutation({
      query: ({ branchId, updatedBranch }) => ({
        url: `/${branchId}`,
        method: "PATCH",
        // headers: { "Content-Type": "application/json" },
        body: updatedBranch,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ email_phone }) => {
        console.log("Resetting password for:", email_phone);
        return {
          url: `/reset-password/${email_phone}`,
          method: "PATCH",
          // headers: { "Content-Type": "application/json" },
        };
      },
    }),

    deleteBranch: builder.mutation({
      query: (branchId) => ({
        url: `/${branchId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateBranchMutation, useLoginBranchMutation, useResetPasswordMutation, useDeleteBranchMutation, useGetAllBranchQuery, useGetBranchQuery, useUpdateBranchMutation } = branchApi;
