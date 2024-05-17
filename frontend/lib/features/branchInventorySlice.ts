import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const branchInventoryApi = createApi({
  reducerPath: "branch-inventory",
  baseQuery,
  endpoints: (builder) => ({
    getAllBranchInventory: builder.query({
      query: ({ branch, sort }) => {
        const params = {
          branch,
          sort,
        };
        return {
          url: "/branch-inventories",
          params: params,
        };
      },
    }),
    getBranchInventory: builder.query({
      query: (branchInventoryId) => `/branch-inventories/${branchInventoryId}`,
    }),

    getBranchInventoryByProduct: builder.query({
      query: (product) => `/branch-inventories/get-branch-inventory-by-product/${product}`,
    }),

    createBranchInventory: builder.mutation({
      query: (newBranchInventory) => ({
        url: `/branch-inventories`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newBranchInventory,
      }),
    }),

    updateBranchInventory: builder.mutation({
      query: ({ branchInventoryId, updatedBranchInventory }) => ({
        url: `/branch-inventories/${branchInventoryId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedBranchInventory,
      }),
    }),

    deleteBranchInventory: builder.mutation({
      query: (branchInventoryId) => ({
        url: `/branch-inventories/${branchInventoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateBranchInventoryMutation, useGetBranchInventoryByProductQuery, useDeleteBranchInventoryMutation, useGetAllBranchInventoryQuery, useGetBranchInventoryQuery, useUpdateBranchInventoryMutation } = branchInventoryApi;
